import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { BranchDto } from '../../services'
import { withEnvironment } from '../extensions/extensions'
import { BranchModel } from './branch'

/**
 * Model description here for TypeScript hints.
 */
export const BranchStoreModel = types
  .model('BranchStore')
  .props({
    branches: types.map(BranchModel)
  })
  .views((self) => ({
    get branchList() {
      return Array.from(self.branches.values())
    }
  }))
  .extend(withEnvironment)
  .actions((self) => ({
    putBranchDdto: (
      branchDto: BranchDto,
      appId: string,
      applicationName: string,
      ownerName: string
    ) => {
      return self.branches.put({
        id: `${ownerName}_${applicationName}_${branchDto.branch.name}`,
        name: branchDto.branch.name,
        configured: branchDto.configured,
        _application: appId
      })
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type BranchStoreType = Instance<typeof BranchStoreModel>

export interface BranchStore extends BranchStoreType {}

type BranchStoreSnapshotType = SnapshotOut<typeof BranchStoreModel>

export interface BranchStoreSnapshot extends BranchStoreSnapshotType {}
