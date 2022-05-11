import { IObjectWithKey } from '@fluentui/react'
import { IAnyModelType, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { Application, ApplicationModel } from '../../application-store'

/**
 * Model description here for TypeScript hints.
 */
export const BranchModel = types
  .model('Branch')
  .props({
    id: types.identifier,
    name: types.string,
    configured: types.boolean,
    _application: types.reference(types.late((): IAnyModelType => ApplicationModel))
  })
  .views((self) => ({
    get key() {
      return self.id
    },
    get application() {
      return self._application as Application
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type BranchType = Instance<typeof BranchModel>

export interface Branch extends BranchType, IObjectWithKey {
  key: string
}

type BranchSnapshotType = SnapshotOut<typeof BranchModel>

export interface BranchSnapshot extends BranchSnapshotType {}
