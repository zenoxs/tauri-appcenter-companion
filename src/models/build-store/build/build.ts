import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const BuildModel = types.model('Build').props({
  buildId: types.number,
  buildNumber: types.string,
  queueTime: types.Date,
  startTime: types.Date,
  finishTime: types.Date,
  lastChangedDate: types.Date,
  status: types.string,
  result: types.string,
  reason: types.string,
  sourceBranch: types.string,
  sourceVersion: types.string,
  tags: types.array(types.string),
  properties: types.map(types.string)
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type BuildType = Instance<typeof BuildModel>

export interface Build extends BuildType {}

type BuildSnapshotType = SnapshotOut<typeof BuildModel>

export interface BuildSnapshot extends BuildSnapshotType {}
