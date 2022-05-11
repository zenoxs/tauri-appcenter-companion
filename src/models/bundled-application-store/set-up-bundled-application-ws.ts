import { onSnapshot } from 'mobx-state-tree'
import { AppcenterApi } from '../../services'
import { AppWebSocketChannel } from '../../websockets/app-websocket-channel'
import { RootStore } from '../root-store'

export const setUpBundledApplicationWs = (rootStore: RootStore, appcenterApi: AppcenterApi) => {
  const websockets: Array<AppWebSocketChannel> = []

  const disconectAllWebSockets = () => {
    for (const websocket of websockets) {
      websocket.close()
    }
  }

  onSnapshot(rootStore.bundledApplicationStore, (snapshot) => {
    console.info('Got new snapshot:', snapshot)
    disconectAllWebSockets()
    for (const snapBundledApp of snapshot.bundledApplications) {
      const bundledApp = rootStore.bundledApplicationStore.bundledApplications.find(
        (b) => b.id === snapBundledApp.id
      )
      if (bundledApp) {
        for (const branch of bundledApp.branches) {
          AppWebSocketChannel.connect(appcenterApi, branch!)
        }
      }
      // bjr
    }
  })
}
