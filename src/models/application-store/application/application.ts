import {
  flow,
  IMaybe,
  IMSTArray,
  Instance,
  IReferenceType,
  IType,
  ReferenceIdentifier,
  SnapshotIn,
  SnapshotOut,
  types
} from 'mobx-state-tree'
import { BranchDto } from '../../../services'
import { Branch, BranchModel } from '../../branch-store'
import { withEnvironment } from '../../extensions/with-environment'
import { withRootStore } from '../../extensions/with-root-store'
import { OwnerModel } from '../../owner-store'
import { TokenModel } from '../../token-store'

export const ApplicationModel$1 = types
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
    owner: types.reference(OwnerModel),
    token: types.reference(TokenModel)
  })
  .extend(withEnvironment)
  .extend(withRootStore)
  .views((self) => ({
    get isBuildable() {
      return self.token?.access === 'fullAccess'
    }
  }))
  .volatile((self) => ({
    isLoading: false
  }))

export interface Application extends Instance<typeof ApplicationModel$1> {
  branches: IMSTArray<IMaybe<IReferenceType<typeof BranchModel>>>
  get configuredBranches(): Array<Branch>
  fetchBranches(): Promise<void>
}

export interface ApplicationSnapshotIn extends SnapshotIn<typeof ApplicationModel$1> {
  branches?: Array<ReferenceIdentifier>
}

export interface ApplicationSnapshotOut extends SnapshotOut<typeof ApplicationModel$1> {
  branches: Array<ReferenceIdentifier>
}

export type ApplicationRunType = IType<ApplicationSnapshotIn, ApplicationSnapshotOut, Application>

export const ApplicationModel: ApplicationRunType = ApplicationModel$1.props({
  branches: types.array(types.reference(BranchModel))
})
  .views((self) => ({
    get configuredBranches() {
      return self.branches.filter((branch) => branch?.configured)
    }
  }))
  .actions((self) => ({
    fetchBranches: flow(function* () {
      self.isLoading = true
      const branchesDto: Array<BranchDto> = yield self.environment.appcenterApi.getBranches(
        self.owner.displayName,
        self.name,
        self.token.token
      )
      self.branches.clear()
      branchesDto.forEach((branchDdto) => {
        const branch = self.rootStore.branchStore.putBranchDdto(
          branchDdto,
          self.id,
          self.name,
          self.owner.displayName
        )
        self.branches.push(branch)
      })
      self.isLoading = false
    })
  }))
