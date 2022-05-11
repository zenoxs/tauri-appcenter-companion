import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const TOKEN_ACCESS = ['fullAccess', 'readOnly']

/**
 * Model description here for TypeScript hints.
 */
export const TokenModel = types.model('Token').props({
  name: types.string,
  token: types.identifier,
  access: types.enumeration('TokenAccess', TOKEN_ACCESS)
})

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type TokenType = Instance<typeof TokenModel>

export interface Token extends TokenType {}

type TokenSnapshotType = SnapshotOut<typeof TokenModel>

export interface TokenSnapshot extends TokenSnapshotType {}
