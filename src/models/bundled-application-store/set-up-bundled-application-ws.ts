import { onSnapshot } from 'mobx-state-tree'
import { Subscription, Subject, concatMap, distinct, debounceTime } from 'rxjs'
import { BundledApplicationStoreSnapshot } from '..'
import { AppcenterApi } from '../../services'
import { AppWebSocketChannel } from '../../websockets/app-websocket-channel'
import { Branch } from '../branch-store'
import { RootStore } from '../root-store'

export const setUpBundledApplicationWs = (rootStore: RootStore, appcenterApi: AppcenterApi) => {
  let websockets: Array<AppWebSocketChannel> = []
  const subscriptions: Array<Subscription> = []
  const storeSnapshot = new Subject<BundledApplicationStoreSnapshot>()

  const disconectAllWebSockets = async () => {
    console.info('disconnect all websockets')
    for (const websocket of websockets) {
      await websocket.close()
    }
    for (const subscription of subscriptions) {
      subscription.unsubscribe()
    }
  }

  onSnapshot(rootStore.bundledApplicationStore, (snapshot) => {
    storeSnapshot.next(snapshot)
  })

  storeSnapshot
    .pipe(
      distinct(),
      debounceTime(100),
      concatMap((snapshot) => {
        return disconectAllWebSockets().then(() => snapshot)
      }),
      concatMap(async (snapshot) => {
        let subBranches: Array<Branch> = []
        // filter the branches to prevent duplicates
        for (const snapBundledApp of snapshot.bundledApplications) {
          const bundledApp = rootStore.bundledApplicationStore.bundledApplications.find(
            (b) => b.id === snapBundledApp.id
          )
          if (bundledApp) {
            subBranches = subBranches.concat(
              bundledApp.branches.filter(
                (b) =>
                  !subBranches.some((sb) => sb.id === b?.id) && b?.application?.owner !== undefined
              ) as Array<Branch>
            )
          }
        }
        console.info({ subBranches: subBranches.map((s) => s.name) })
        return Promise.all(
          subBranches.map(async (branch) => {
            const ws = await AppWebSocketChannel.connect(appcenterApi, branch)
            const sub = ws.events.subscribe((event) => {
              if (event.type === 'buildUpdated') {
                rootStore.branchStore.branches.get(branch.id)?.setBuild(event.data)
              }
            })
            subscriptions.push(sub)
            return ws
          })
        )
      })
    )
    .subscribe((subSockets) => (websockets = subSockets))

  window.onbeforeunload = function () {
    disconectAllWebSockets()
  }
}
