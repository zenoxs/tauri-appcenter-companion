import { onSnapshot, applySnapshot, IStateTreeNode } from 'mobx-state-tree'
import { StorageEngine } from '../../services/storage'

export interface IOptions {
  storage: StorageEngine
  readonly whitelist?: Array<string>
  readonly blacklist?: Array<string>
}
export interface IArgs {
  (name: string, store: IStateTreeNode, options?: IOptions): Promise<void>
}
type StrToAnyMap = { [key: string]: any }

export const persist: IArgs = (name, store, options) => {
  const { storage, whitelist, blacklist } = options ?? {}

  // use AsyncLocalStorage by default (or if localStorage was passed in)
  if (!storage) {
    return Promise.reject(
      new Error(
        'localStorage (the default storage engine) is not ' +
          'supported in this environment. Please configure a different storage ' +
          'engine via the `storage:` option.'
      )
    )
  }

  const whitelistDict = arrToDict(whitelist)
  const blacklistDict = arrToDict(blacklist)

  onSnapshot(store, (_snapshot: StrToAnyMap) => {
    // need to shallow clone as otherwise properties are non-configurable (https://github.com/agilgur5/mst-persist/pull/21#discussion_r348105595)
    const snapshot = { ..._snapshot }
    Object.keys(snapshot).forEach((key) => {
      if (whitelist && !whitelistDict[key]) {
        delete snapshot[key]
      }
      if (blacklist && blacklistDict[key]) {
        delete snapshot[key]
      }
    })
    storage.setItem(name, snapshot)
  })

  return storage.getItem<object | string>(name).then((data) => {
    const snapshot = !isString(data) ? data : JSON.parse(data)
    // don't apply falsey (which will error), leave store in initial state
    if (!snapshot) {
      return
    }
    applySnapshot(store, snapshot)
  })
}

type StrToBoolMap = { [key: string]: boolean }

function arrToDict(arr?: Array<string>): StrToBoolMap {
  if (!arr) {
    return {}
  }
  return arr.reduce((dict: StrToBoolMap, elem) => {
    dict[elem] = true
    return dict
  }, {})
}

function isString(value: any): value is string {
  return typeof value === 'string'
}

export default persist
