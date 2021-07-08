import Cookie from 'js-cookie'

Cookie.defaults = {
  sameSite: 'Lax',
}

export class CookiesService {
  constructor(store) {
    this.store = store
  }

  get(key, defaultValue) {
    try {
      const item = this.store.get(key)

      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  set(key, value) {
    this.store.set(key, JSON.stringify(value))
  }

  remove(key) {
    this.store.remove(key)
  }
}

export default new CookiesService(Cookie)
