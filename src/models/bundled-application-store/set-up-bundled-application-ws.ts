import { onSnapshot } from 'mobx-state-tree'
import { BundledApplicationStore } from './bundled-application-store'

export const setUpBundledApplicationWs = (bundledApplicationStore: BundledApplicationStore) => {
  onSnapshot(bundledApplicationStore, (newSnapshot) => {
    console.info('Got new snapshot:', newSnapshot)
  })
}
