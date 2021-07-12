export const isProduction = process.env.NODE_ENV === 'production'

export const themes = ['sky', 'blue', 'indigo', 'red', 'pink', 'orange', 'yellow', 'lime', 'green', 'gray']

export const appName = Object.freeze({
  long: process.env.APP_LONG_NAME,
  short: process.env.APP_SHORT_NAME,
})

export const apiUrl = process.env.APP_API_URL

const v1 = '/api/v1'

export const endpoints = Object.freeze({
  auth: { refresh: `${v1}/refresh`, login: `${v1}/sign-in`, registration: `${v1}/sign-up` },
  user: { list: `${v1}/users`, me: `${v1}/me` },
  board: { list: `${v1}/boards`, one: (id) => `${v1}/boards/${id}` },
  category: { list: `${v1}/categories` },
  tag: { list: `${v1}/tags` },
})

export const routes = Object.freeze({
  root: '/',
  error: { notFound: '/404' },
  auth: { login: '/login', registration: '/registration', forgotPassword: '/forgot' },
  board: { list: '/boards', one: (id = ':boardId') => `/boards/${id}` },
})

export const validation = Object.freeze({
  email: /\S+@\S+\.\S+/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w\s\-^$&*!@#]{8,64}$/,
})

export const dndTypes = Object.freeze({
  category: 'CATEGORY',
  card: 'CARD',
})
