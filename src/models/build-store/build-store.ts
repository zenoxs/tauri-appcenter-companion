import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { BuildDto } from '../../services'
import { withEnvironment } from '../extensions/extensions'
import { BuildModel } from './build'

/**
 * Model description here for TypeScript hints.
 */
export const BuildStoreModel = types
  .model('BuildStore')
  .props({
    builds: types.map(BuildModel)
  })
  .views((self) => ({
    get buildList() {
      return Array.from(self.builds.values())
    }
  }))
  .extend(withEnvironment)
  .actions((self) => ({
    putBuild: (build: BuildDto) => {
      return self.builds.put({
        buildId: build.id,
        buildNumber: build.buildNumber,
        queueTime: build.queueTime,
        startTime: build.startTime,
        finishTime: build.finishTime,
        lastChangedDate: build.lastChangedDate,
        status: build.status,
        result: build.result,
        reason: build.reason,
        sourceBranch: build.sourceBranch,
        sourceVersion: build.sourceVersion,
        tags: build.tags,
        properties: build.properties
      })
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type BuildStoreType = Instance<typeof BuildStoreModel>

export interface BuildStore extends BuildStoreType {}

type BuildStoreSnapshotType = SnapshotOut<typeof BuildStoreModel>

export interface BuildStoreSnapshot extends BuildStoreSnapshotType {}
