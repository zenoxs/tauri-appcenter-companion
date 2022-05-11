import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withEnvironment } from '../extensions/extensions'
import { TokenModel, Token, TokenSnapshot } from './token'

/**
 * Model description here for TypeScript hints.
 */
export const TokenStoreModel = types
  .model('TokenStore')
  .props({
    tokens: types.array(TokenModel)
  })
  .extend(withEnvironment)
  .actions((self) => ({
    addToken: (token: TokenSnapshot) => {
      return self.tokens.push(token)
    },
    removeToken: (token: Token) => {
      const _token = self.tokens.find((_token) => _token.name === token.name)
      if (_token) {
        return self.tokens.remove(_token)
      }
      return false
    }
  }))

/**
 * Un-comment the following to omit model attributes from your snapshots (and from async storage).
 * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

 * Note that you'll need to import `omit` from ramda, which is already included in the project!
 *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
 */

type TokenStoreType = Instance<typeof TokenStoreModel>

export interface TokenStore extends TokenStoreType {}

type TokenStoreSnapshotType = SnapshotOut<typeof TokenStoreModel>

export interface TokenStoreSnapshot extends TokenStoreSnapshotType {}
