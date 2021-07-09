class LocalStorageService {
  get(key, defaultValue) {
    try {
      const item = window.localStorage.getItem(key)

      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key) {
    window.localStorage.removeItem(key)
  }
}

export default new LocalStorageService()
