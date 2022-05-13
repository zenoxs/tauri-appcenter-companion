import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuid } from 'uuid'
import { BranchModel } from '../../branch-store'

/**
 * Model description here for TypeScript hints.
 */
export const BundledApplicationModel = types.model('BundledApplication').props({
  id: types.optional(types.identifier, () => uuid()),
  name: types.string,
  branches: types.array(types.safeReference(BranchModel))
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type BundledApplicationType = Instance<typeof BundledApplicationModel>

export interface BundledApplication extends BundledApplicationType {}

type BundledApplicationSnapshotType = SnapshotOut<typeof BundledApplicationModel>

export interface BundledApplicationSnapshot extends BundledApplicationSnapshotType {}

type BundledApplicationSnapshotInType = SnapshotIn<typeof BundledApplicationModel>

export interface BundledApplicationSnapshotIn extends BundledApplicationSnapshotInType {}
