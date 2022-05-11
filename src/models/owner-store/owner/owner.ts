import { Instance, SnapshotOut, types } from 'mobx-state-tree'

/**
 * Model description here for TypeScript hints.
 */
export const OwnerModel = types.model('Owner').props({
  id: types.identifier,
  displayName: types.string,
  avatarUrl: types.maybeNull(types.string),
  type: types.enumeration('OwnerType', ['org', 'user'])
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type OwnerType = Instance<typeof OwnerModel>

export interface Owner extends OwnerType {}

type OwnerSnapshotType = SnapshotOut<typeof OwnerModel>

export interface OwnerSnapshot extends OwnerSnapshotType {}
