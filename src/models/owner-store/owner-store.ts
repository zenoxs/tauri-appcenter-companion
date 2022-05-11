import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { OwnerDto } from '../../services'
import { withEnvironment } from '../extensions/extensions'
import { OwnerModel } from './owner'

/**
 * Model description here for TypeScript hints.
 */
export const OwnerStoreModel = types
  .model('OwnerStore')
  .props({
    owners: types.map(OwnerModel)
  })
  .views((self) => ({
    get ownerList() {
      return Array.from(self.owners.values())
    }
  }))
  .extend(withEnvironment)
  .actions((self) => ({
    putOwner: (owner: OwnerDto) => {
      return self.owners.put({
        id: owner.id,
        displayName: owner.display_name,
        avatarUrl: owner.avatar_url,
        type: owner.type
      })
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type OwnerStoreType = Instance<typeof OwnerStoreModel>

export interface OwnerStore extends OwnerStoreType {}

type OwnerStoreSnapshotType = SnapshotOut<typeof OwnerStoreModel>

export interface OwnerStoreSnapshot extends OwnerStoreSnapshotType {}
