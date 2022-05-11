import { SnapshotOut, types } from 'mobx-state-tree'
import { ApplicationStore, ApplicationStoreModel } from '../application-store'
import { BranchStore, BranchStoreModel } from '../branch-store'
import { BundledApplicationStore, BundledApplicationStoreModel } from '../bundled-application-store'
import { OwnerStore, OwnerStoreModel } from '../owner-store'
import { TokenStore, TokenStoreModel } from '../token-store'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model('RootStore').props({
  bundledApplicationStore: types.optional(BundledApplicationStoreModel, {}),
  applicationStore: types.optional(ApplicationStoreModel, {}),
  ownerStore: types.optional(OwnerStoreModel, {}),
  branchStore: types.optional(BranchStoreModel, {}),
  tokenStore: types.optional(TokenStoreModel, {})
})

/**
 * The RootStore instance.
 */
export interface RootStore {
  bundledApplicationStore: BundledApplicationStore
  applicationStore: ApplicationStore
  ownerStore: OwnerStore
  branchStore: BranchStore
  tokenStore: TokenStore
}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
