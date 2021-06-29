export const isProduction = process.env.NODE_ENV === 'production'

export const appName = Object.freeze({
  long: process.env.APP_LONG_NAME,
  short: process.env.APP_SHORT_NAME,
})

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

export const size = Object.freeze({
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
})

export const colors = Object.freeze({
  sky: {
    c100: '#e0f2fe',
    c200: '#bae6fd',
    c400: '#38bdf8',
    c600: '#0284c7',
    c700: '#0369a1',
    c900: '#0c4a6e',
  },
  blue: { c600: '#2563eb', c700: '#1d4ed8' },
  indigo: { c600: '#4f46e5', c700: '#4338ca' },
  red: { c500: '#ef4444', c600: 'dc2626', c700: '#b91c1c' },
  pink: { c600: '#db2777', c700: '#be185d' },
  orange: { c400: '#fb923c', c500: '#f97316' },
  yellow: { c400: '#facc15', c500: '#eab308' },
  lime: { c600: '#65a30d', c700: '#4d7c0f' },
  green: { c600: '#16a34a', c700: '#15803d' },
  blueGray: {
    c300: '#cbd5e1',
    c400: '#94a3b8',
    c500: '#64748b',
    c600: '#475569',
    c700: '#334155',
    c800: '#1e293b',
    c900: '#0f172a',
  },
  gray: {
    c50: '#fafafa',
    c100: '#f4f4f5',
    c200: '#e4e4e7',
    c300: '#d4d4d8',
    c400: '#a1a1aa',
    c500: '#71717a',
    c700: '#3f3f46',
    c800: '#27272a',
    c900: '#18181b',
  },
  black: (alpha = 1) => `rgba(34, 34, 34, ${alpha})`,
  white: (alpha = 1) => `rgba(255, 255, 255, ${alpha})`,
})
