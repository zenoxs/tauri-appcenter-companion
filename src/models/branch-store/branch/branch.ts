import { IObjectWithKey } from '@fluentui/react'
import { flow, IAnyModelType, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { BuildDto } from '../../../services'
import { Application, ApplicationModel } from '../../application-store'
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
    _application: types.safeReference(types.late((): IAnyModelType => ApplicationModel))
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .views((self) => ({
    get key() {
      return self.id
    },
    get application(): Application | undefined {
      return self._application as Application | undefined
    }
  }))
  .views((self) => ({
    get canBuild() {
      // can't be typped because of circular dependencies
      return self._application?.token?.access === 'fullAccess'
    }
  }))
  .actions((self) => ({
    setBuild(build: BuildDto) {
      self.lastBuild = self.rootStore.buildStore.putBuild(build)
    },
    startBuild: flow(function* () {
      console.log('startBuild')
      self.environment.appcenterApi.buildBranch({
        ownerName: self.application!.owner!.displayName,
        applicationName: self.application!.name,
        branchName: self.name,
        commit: self.lastCommit,
        token: self.application!.token!.token
      })
    }),
    cancelBuild: flow(function* () {
      self.environment.appcenterApi.buildBranch({
        ownerName: self.application!.owner!.displayName,
        applicationName: self.application!.name,
        branchName: self.name,
        commit: self.lastCommit,
        token: self.application!.token!.token
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

type BranchSnapshotType = SnapshotOut<typeof BranchModel>

export interface BranchSnapshot extends BranchSnapshotType {}
