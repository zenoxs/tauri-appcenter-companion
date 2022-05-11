import { Branch } from '../models'
import { AppcenterApi } from '../services'

interface SocketMethod {
  method: 'subscribe' | 'watchRepo'
}

interface IWatchRepoMethod extends SocketMethod {
  method: 'watchRepo'
}

const watchRepoMethod: IWatchRepoMethod = { method: 'watchRepo' }

export class AppWebSocketChannel {
  private constructor(private _wsUrl: string, private _branch: Branch) {
    const socket = new WebSocket(_wsUrl)

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify(watchRepoMethod))
    })

    socket.addEventListener('message', (message) => {
      console.log(message)
    })
  }

  static async connect(appcenterApi: AppcenterApi, branch: Branch): Promise<AppWebSocketChannel> {
    const wsUrl = await appcenterApi.getWebsocket(
      branch.application.owner!.displayName,
      branch.application.name,
      branch.application.token!.token
    )
    return new AppWebSocketChannel(wsUrl, branch)
  }
}
