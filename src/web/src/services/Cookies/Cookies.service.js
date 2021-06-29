import Cookie from 'js-cookie'

Cookie.defaults = {
  sameSite: 'Lax',
}

const Cookies = {
  get: (key, defaultValue) => {
    try {
      const item = Cookie.get(key)

      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key, value) => Cookie.set(key, JSON.stringify(value)),
  remove: (key) => Cookie.remove(key),
}

export default Cookies
