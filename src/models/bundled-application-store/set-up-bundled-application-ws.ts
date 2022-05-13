import { onSnapshot } from 'mobx-state-tree'
import { Subscription } from 'rxjs'
import { AppcenterApi } from '../../services'
import { AppWebSocketChannel } from '../../websockets/app-websocket-channel'
import { Branch } from '../branch-store'
import { RootStore } from '../root-store'

export const setUpBundledApplicationWs = (rootStore: RootStore, appcenterApi: AppcenterApi) => {
  let websockets: Array<AppWebSocketChannel> = []
  const subscriptions: Array<Subscription> = []

  const disconectAllWebSockets = () => {
    console.log('disconnect all websockets')
    for (const websocket of websockets) {
      websocket.close()
    }
    for (const subscription of subscriptions) {
      subscription.unsubscribe()
    }
  }

  onSnapshot(rootStore.bundledApplicationStore, (snapshot) => {
    console.info('Got new snapshot:', snapshot)
    disconectAllWebSockets()
    let subBranches: Array<Branch> = []
    for (const snapBundledApp of snapshot.bundledApplications) {
      const bundledApp = rootStore.bundledApplicationStore.bundledApplications.find(
        (b) => b.id === snapBundledApp.id
      )
      if (bundledApp) {
        subBranches = subBranches.concat(bundledApp.branches as Array<Branch>)
      }
      Promise.all(
        subBranches.map(async (branch) => {
          const ws = await AppWebSocketChannel.connect(appcenterApi, branch)
          const sub = ws.events.subscribe((event) => {
            console.log(event)
            if (event.type === 'buildUpdated') {
              rootStore.branchStore.branches.get(branch.id)?.setBuild(event.data)
            }
          })
          subscriptions.push(sub)
          return ws
        })
      ).then((subscribedWebsockets) => {
        websockets = subscribedWebsockets
      })
    }
  })
}
