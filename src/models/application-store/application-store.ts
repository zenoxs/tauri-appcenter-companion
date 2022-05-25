import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { ApplicationDto } from '../../services'
import { withEnvironment, withRootStore } from '../extensions/extensions'
import { ApplicationModel } from './application'

/**
 * Model description here for TypeScript hints.
 */
export const ApplicationStoreModel = types
  .model('ApplicationStore')
  .props({
    applications: types.map(ApplicationModel)
  })
  .views((self) => ({
    get applicationList() {
      return Array.from(self.applications.values())
    }
  }))
  .views((self) => ({
    applicationsByToken(searchToken: string) {
      return self.applicationList.filter((application) => application.token?.token === searchToken)
    }
  }))
  .extend(withEnvironment)
  .extend(withRootStore)
  .actions((self) => ({
    fetchApplications: flow(function* (token: string, options?: { withBranches: boolean }) {
      const dto: Array<ApplicationDto> = yield self.environment.appcenterApi.getApplications(token)
      const addedApplications = []
      for (const applicationDto of dto) {
        const owner = self.rootStore.ownerStore.putOwner(applicationDto.owner)
        const addedApplication = self.applications.put({
          id: applicationDto.id,
          name: applicationDto.name,
          displayName: applicationDto.display_name,
          iconUrl: applicationDto.icon_url,
          description: applicationDto.description,
          os: applicationDto.os,
          platform: applicationDto.platform,
          owner: owner.id,
          token
        })
        addedApplications.push(addedApplication)
      }
      if (options?.withBranches) {
        yield Promise.all(addedApplications.map((application) => application.fetchBranches()))
      }
    })
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type ApplicationStoreType = Instance<typeof ApplicationStoreModel>

export interface ApplicationStore extends ApplicationStoreType {}

type ApplicationStoreSnapshotType = SnapshotOut<typeof ApplicationStoreModel>

export interface ApplicationStoreSnapshot extends ApplicationStoreSnapshotType {}
