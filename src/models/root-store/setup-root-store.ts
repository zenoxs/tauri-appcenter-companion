import { Instance } from 'mobx-state-tree'
import { TauriStorageEngine } from '../../services'
import { Environment } from '../environment'
import { RootStoreModel } from './root-store'
import persist from './root-store-persist'
/**
 * The key we'll be saving our state as within async storage.
 */
// const ROOT_STATE_STORAGE_KEY = 'root'

/**
 * Setup the root state.
 */
export async function setupRootStore() {
  // prepare the environment that will be associated with the RootStore.
  const env = await Environment.create()
  const storage = TauriStorageEngine.create('.root-store.dat')
  const rootStore: Instance<typeof RootStoreModel> = RootStoreModel.create({}, env)

  persist('rootStore', rootStore, {
    storage
  }).then(() => console.info('rootStore has been restored'))

  return rootStore
}
