import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { BundledApplication } from '..'
import { Application } from '../application-store'
import { withEnvironment } from '../extensions/extensions'
import { BundledApplicationModel, BundledApplicationSnapshotIn } from './bundled-application'

/**
 * Model description here for TypeScript hints.
 */
export const BundledApplicationStoreModel = types
  .model('BundledApplicationStore')
  .props({
    bundledApplications: types.array(BundledApplicationModel)
  })
  .extend(withEnvironment)
  .volatile((self) => ({
    initialLoading: false
  }))
  .actions((self) => ({
    addBundledApplication(bundledApplication: BundledApplicationSnapshotIn) {
      self.bundledApplications.push(bundledApplication)
    },
    removeBundledApplication(bundledApplication: BundledApplication) {
      self.bundledApplications.remove(bundledApplication)
    },
    refresh: flow(function* () {
      const appsToFetch: Record<string, Application> = {}
      self.bundledApplications.forEach((bundledApplication) => {
        bundledApplication.branches.forEach((branch) => {
          if (branch?.application?.id && !appsToFetch[branch.application.id]) {
            appsToFetch[branch.application.id] = branch.application
          }
        })
      })
      yield Promise.all(Object.entries(appsToFetch).map(([, app]) => app.fetchBranches()))
      self.initialLoading = true
    })
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type BundledApplicationStoreType = Instance<typeof BundledApplicationStoreModel>

export interface BundledApplicationStore extends BundledApplicationStoreType {}

type BundledApplicationStoreSnapshotType = SnapshotOut<typeof BundledApplicationStoreModel>

export interface BundledApplicationStoreSnapshot extends BundledApplicationStoreSnapshotType {}
