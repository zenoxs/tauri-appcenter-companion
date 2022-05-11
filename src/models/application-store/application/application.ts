import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree'
import { BranchDto } from '../../../services'
import { BranchModel } from '../../branch-store'
import { withEnvironment } from '../../extensions/with-environment'
import { withRootStore } from '../../extensions/with-root-store'
import { OwnerModel } from '../../owner-store'
import { TokenModel } from '../../token-store'

/**
 * Model description here for TypeScript hints.
 */
export const ApplicationModel = types
  .model('Application')
  .props({
    id: types.identifier,
    name: types.string,
    displayName: types.string,
    description: types.maybeNull(types.string),
    iconUrl: types.maybeNull(types.string),
    os: types.enumeration('OS', ['Android', 'iOS', 'Windows', 'macOS', 'tvOS', 'Custom']),
    platform: types.enumeration('Platform', [
      'React-Native',
      'Objective-C-Swift',
      'Java',
      'Xamarin',
      'Unity',
      'UWP',
      'WPF',
      'WinForms'
    ]),
    branches: types.array(types.safeReference(BranchModel)),
    owner: types.safeReference(OwnerModel),
    token: types.safeReference(TokenModel)
  })
  .views((self) => ({
    get configuredBranches() {
      return self.branches.filter((branch) => branch?.configured)
    }
  }))
  .volatile((self) => ({
    isLoading: false
  }))
  .extend(withEnvironment)
  .extend(withRootStore)
  .actions((self) => ({
    fetchBranches: flow(function* () {
      self.isLoading = true
      const branchesDto: Array<BranchDto> = yield self.environment.appcenterApi.getBranches(
        self.owner!.displayName,
        self.name,
        self.token!.token
      )
      self.branches.clear()
      branchesDto.forEach((branchDdto) => {
        const branch = self.rootStore.branchStore.putBranchDdto(
          branchDdto,
          self.id,
          self.name,
          self.owner!.displayName
        )
        self.branches.push(branch)
      })
      self.isLoading = false
    })
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type ApplicationType = Instance<typeof ApplicationModel>

export interface Application extends ApplicationType {}

type ApplicationSnapshotType = SnapshotOut<typeof ApplicationModel>

export interface ApplicationSnapshot extends ApplicationSnapshotType {}
