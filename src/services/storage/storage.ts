import { Store } from 'tauri-plugin-store-api'

export interface StorageEngine {
  getItem<T>(key: string): Promise<T | null>
  setItem(key: string, value: unknown): Promise<void>
}

export class TauriStorageEngine implements StorageEngine {
  private readonly _store: Store

  private constructor(store: Store) {
    this._store = store
  }

  static create(name: string): TauriStorageEngine {
    const store = new Store(name)
    return new TauriStorageEngine(store)
  }

  getItem<T>(key: string): Promise<T | null> {
    return this._store.get(key)
  }

  setItem(key: string, value: unknown): Promise<void> {
    return this._store.set(key, value)
  }
}
