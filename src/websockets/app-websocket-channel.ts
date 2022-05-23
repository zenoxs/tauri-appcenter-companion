import { Subject } from 'rxjs'
import WebSocket, { Message } from 'tauri-plugin-websocket'
import { Branch } from '../models'
import { AppcenterApi, BuildDto } from '../services'

interface SocketMethod {
  readonly method: 'subscribe' | 'watch-repo'
  toJson: () => string
}

class WatchRepoMethod implements SocketMethod {
  readonly method = 'watch-repo'

  toJson() {
    return JSON.stringify({ method: this.method })
  }
}

class BuildSubscribeMethod implements SocketMethod {
  readonly method = 'subscribe'

  public readonly buildId: number

  constructor(buildId: number) {
    this.buildId = buildId
  }

  toJson() {
    return JSON.stringify({ method: this.method, buildId: this.buildId })
  }
}

class WsHeartBeat {
  readonly type = 'WEBSOCKET_HEARTBEAT_MESSAGE'

  toJson() {
    return JSON.stringify({ type: this.type })
  }
}

interface WsAppEventSchema {
  type: 'buildUpdated' | 'logConsoleLines'
}

export interface WsAppBuildUpdatedEvent extends WsAppEventSchema {
  type: 'buildUpdated'
  data: BuildDto
}

export interface WsAppLogConsoleLinesEvent extends WsAppEventSchema {
  type: 'logConsoleLines'
  buildId: number
  data: Object
}

export type WsAppEvent = WsAppBuildUpdatedEvent | WsAppLogConsoleLinesEvent

export class AppWebSocketChannel {
  static TIMEOUT_RECONNECT = 20 * 1000
  static async connect(appcenterApi: AppcenterApi, branch: Branch): Promise<AppWebSocketChannel> {
    if (AppWebSocketChannel._openedWebSockets[branch.application!.id]) {
      return AppWebSocketChannel._openedWebSockets[branch.application!.id]
    }
    const socket = await AppWebSocketChannel._createSocket(appcenterApi, branch)
    const channel = new AppWebSocketChannel(socket, branch, appcenterApi)
    AppWebSocketChannel._openedWebSockets[branch.application!.id] = channel
    return channel
  }

  private static async _createSocket(
    appcenterApi: AppcenterApi,
    branch: Branch
  ): Promise<WebSocket> {
    const wsUrl = await appcenterApi.getWebsocket(
      branch.application!.owner!.displayName,
      branch.application!.name,
      branch.application!.token!.token
    )
    const socket = await WebSocket.connect(wsUrl)
    return socket
  }

  // eslint-disable-next-line no-use-before-define
  static readonly _openedWebSockets: Record<string, AppWebSocketChannel> = {}

  private _heartbeatInterval?: number

  private _eventSubject = new Subject<WsAppEvent>()
  private _subscribedBuildIds: Set<number> = new Set()

  private constructor(
    private _socket: WebSocket,
    private readonly _branch: Branch,
    private readonly _api: AppcenterApi
  ) {
    console.info(`open ws ${this._branch.name}`)
    this._setUpListeners()
  }

  private _setUpListeners() {
    this._socket.addListener((message) => this._onMessage(message))
    this._method(new WatchRepoMethod())
    if (this._branch?.lastBuild?.status === 'inProgress') {
      this._method(new BuildSubscribeMethod(this._branch.lastBuild?.buildId))
      this._subscribedBuildIds.add(this._branch.lastBuild?.buildId)
    }

    this._heartbeatInterval = setInterval(() => {
      this._socket.send(new WsHeartBeat().toJson())
    }, 30 * 1000)
  }

  private _onMessage(message: Message) {
    if (message.type === 'Close') {
      console.warn(message)
      this._reconnect()
      return
    }
    if (message.type !== 'Text') {
      console.debug(message)
      if (
        typeof message === 'string' &&
        (message as string).startsWith('WebSocket protocol error')
      ) {
        this._reconnect()
      }
      return
    }
    const event: WsAppEvent = message.data ? JSON.parse(message.data) : {}
    if (event.type === 'buildUpdated') {
      if (event.data.sourceBranch === this._branch.name) {
        if (!this._subscribedBuildIds.has(event.data.id)) {
          this._method(new BuildSubscribeMethod(event.data.id))
          this._subscribedBuildIds.add(event.data.id)
        }
        // TODO: maybe only emit for current branches
        this._eventSubject.next(event)
      }
    } else if (event.type === 'logConsoleLines') {
      this._eventSubject.next(event)
    } else {
      console.debug(message)
    }
  }

  readonly events = this._eventSubject.asObservable()

  async close() {
    await this._socket.disconnect()
    this._eventSubject.complete()
    clearInterval(this._heartbeatInterval)
  }

  private _method(method: SocketMethod) {
    return this._socket.send(method.toJson())
  }

  private async _reconnect() {
    console.warn('try reconnect ws ' + this._branch.application.displayName)
    this.close()
      .catch(console.error)
      .then(
        () =>
          new Promise<void>(function (resolve, reject) {
            setTimeout(function () {
              resolve()
            }, AppWebSocketChannel.TIMEOUT_RECONNECT)
          })
      )
      .then(async () => {
        this._socket = await AppWebSocketChannel._createSocket(this._api, this._branch)
      })
      .then(() => this._setUpListeners())
      .catch((err) => {
        console.error(err)
        return this._reconnect()
      })
  }
}
