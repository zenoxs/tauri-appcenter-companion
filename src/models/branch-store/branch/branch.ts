import { IObjectWithKey } from '@fluentui/react'
import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { BuildDto } from '../../../services'
import { ApplicationModel, ApplicationRunType } from '../../application-store'
import { BuildModel } from '../../build-store'
import { withEnvironment } from '../../extensions/with-environment'
import { withRootStore } from '../../extensions/with-root-store'

/**
 * Model description here for TypeScript hints.
 */
export const BranchModel = types
  .model('Branch')
  .props({
    id: types.identifier,
    name: types.string,
    configured: types.boolean,
    lastCommit: types.string,
    lastBuild: types.safeReference(BuildModel),
    application: types.reference(types.late((): ApplicationRunType => ApplicationModel))
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .views((self) => ({
    get key() {
      return self.id
    }
  }))
  .views((self) => ({
    get isBuildable() {
      return self.application.token.access === 'fullAccess'
    }
  }))
  .actions((self) => ({
    setBuild(build: BuildDto) {
      self.lastBuild = self.rootStore.buildStore.putBuild(build)
    },
    startBuild: flow(function* () {
      self.environment.appcenterApi.buildBranch({
        ownerName: self.application.owner.displayName,
        applicationName: self.application.name,
        branchName: self.name,
        commit: self.lastCommit,
        token: self.application.token.token
      })
    }),
    cancelBuild: flow(function* () {
      if (!self.lastBuild) {
        throw new Error('No build to cancel')
      }
      self.environment.appcenterApi.cancelBranchBuild({
        ownerName: self.application.owner.displayName,
        applicationName: self.application.name,
        buildId: self.lastBuild?.buildId,
        token: self.application.token.token
      })
    })
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

type BranchSnapshotOutType = SnapshotOut<typeof BranchModel>

export interface BranchSnapshotOut extends BranchSnapshotOutType {}

type BranchSnapshotInType = SnapshotOut<typeof BranchModel>

export interface BranchSnapshotIn extends BranchSnapshotInType {}
