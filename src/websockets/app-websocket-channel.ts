import { Subject } from 'rxjs'
import { Branch } from '../models'
import { AppcenterApi, BuildDto } from '../services'

interface SocketMethod {
  readonly method: 'subscribe' | 'watchRepo'
  toJson: () => string
}

class WatchRepoMethod implements SocketMethod {
  readonly method = 'watchRepo'

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
  static async connect(appcenterApi: AppcenterApi, branch: Branch): Promise<AppWebSocketChannel> {
    const wsUrl = await appcenterApi.getWebsocket(
      branch.application.owner!.displayName,
      branch.application.name,
      branch.application.token!.token
    )
    if (AppWebSocketChannel._openedWebSockets[branch.application.id]) {
      return AppWebSocketChannel._openedWebSockets[branch.application.id]
    }
    const channel = new AppWebSocketChannel(wsUrl, branch)
    AppWebSocketChannel._openedWebSockets[branch.application.id] = channel
    return channel
  }

  // eslint-disable-next-line no-use-before-define
  static readonly _openedWebSockets: Record<string, AppWebSocketChannel> = {}

  private readonly _socket: WebSocket
  private readonly _heartbeatInterval: number

  private _eventSubject = new Subject<WsAppEvent>()
  private _subscribedBuildIds: Set<number> = new Set()

  private constructor(private _wsUrl: string, private _branch: Branch) {
    this._socket = new WebSocket(_wsUrl)

    this._socket.addEventListener('open', () => {
      console.log(`open ws ${this._branch.name}`)
      this._method(new WatchRepoMethod())
    })

    this._socket.addEventListener('message', (message) => {
      const event = message.data as WsAppEvent
      console.log(event)
      if (event.type === 'buildUpdated') {
        if (event.data.sourceBranch === this._branch.name) {
          if (!this._subscribedBuildIds.has(event.data.id)) {
            this._method(new BuildSubscribeMethod(event.data.id))
            this._subscribedBuildIds.add(event.data.id)
          }
          this._eventSubject.next(event)
        }
      } else {
        this._eventSubject.next(event)
      }
    })

    this._socket.addEventListener('error', (error) => {
      console.log(error)
    })

    this._socket.addEventListener('close', (message) => {
      console.log(message)
    })

    this._heartbeatInterval = setInterval(() => {
      this._socket.send(new WsHeartBeat().toJson())
    }, 30 * 1000)
  }

  readonly events = this._eventSubject.asObservable()

  close() {
    this._socket.close()
    clearInterval(this._heartbeatInterval)
  }

  private _method(method: SocketMethod) {
    this._socket.send(JSON.stringify(method.toJson()))
  }
}
