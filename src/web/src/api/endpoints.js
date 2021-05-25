export const API_URL = process.env.APP_API_URL

export const ENDPOINTS = {
  AUTH: {
    REFRESH: '/refresh',
    LOGIN: '/sign-in',
    REGISTRATION: '/sign-up',
    VERIFICATION: (code) => `/verify/${code}`,
  },
  USER: {
    ME: '/user/me',
  },
}
