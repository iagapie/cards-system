export const API_URL = process.env.APP_API_URL

export const ENDPOINTS = {
  HEARTBEAT: '/api/heartbeat',
  AUTH: {
    REFRESH: '/api/v1/refresh',
    LOGIN: '/api/v1/sign-in',
    REGISTRATION: '/api/v1/sign-up',
  },
  USER: {
    ME: '/api/v1/me',
  },
}
