export class LocalStorageService {
  constructor(store) {
    this.store = store
  }

  get(key, defaultValue) {
    try {
      const item = this.store.getItem(key)

      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  set(key, value) {
    this.store.setItem(key, JSON.stringify(value))
  }

  remove(key) {
    this.store.removeItem(key)
  }
}

export default new LocalStorageService(window.localStorage)
