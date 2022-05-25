import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree'
import { v4 as uuid } from 'uuid'
import { BuildResult, BuildStatus } from '../../../services'
import { Branch, BranchModel } from '../../branch-store'

/**
 * Model description here for TypeScript hints.
 */
export const BundledApplicationModel = types
  .model('BundledApplication')
  .props({
    id: types.optional(types.identifier, () => uuid()),
    name: types.string,
    branches: types.array(types.safeReference(BranchModel))
  })
  .views((self) => ({
    get status(): BuildStatus {
      if (self.branches.some((b) => b?.lastBuild?.status === 'inProgress')) {
        return 'inProgress'
      }
      if (self.branches.some((b) => b?.lastBuild?.status === 'notStarted')) {
        return 'notStarted'
      }
      if (self.branches.some((b) => b?.lastBuild?.status === 'cancelling')) {
        return 'cancelling'
      }
      return 'completed'
    },
    get result(): BuildResult | undefined {
      if (self.branches.some((b) => b?.lastBuild?.result === 'failed')) {
        return 'failed'
      }
      if (self.branches.every((b) => b?.lastBuild?.result === 'succeeded')) {
        return 'succeeded'
      }
      if (self.branches.every((b) => b?.lastBuild?.result === 'cancelled')) {
        return 'cancelled'
      }
    },
    get isBuildable() {
      return self.branches.every((b) => b?.isBuildable)
    }
  }))
  .actions((self) => ({
    addBranch(branch: Branch) {
      self.branches.push(branch)
    },
    addBranches(branches: Branch[]) {
      self.branches.push(...branches)
    },
    startBuild() {
      self.branches.forEach((b) => b?.startBuild())
    },
    cancelBuild() {
      self.branches.forEach((b) => b?.cancelBuild())
    },
    removeBranch(branch: Branch) {
      self.branches.remove(branch)
    }
  }))

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
