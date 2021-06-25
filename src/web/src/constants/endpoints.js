export const API_URL = process.env.APP_API_URL

const v1 = '/api/v1'

export const ENDPOINTS = {
  AUTH: {
    REFRESH: `${v1}/refresh`,
    LOGIN: `${v1}/sign-in`,
    REGISTRATION: `${v1}/sign-up`,
  },
  ME: `${v1}/me`,
  USERS: `${v1}/users`,
  BOARDS: `${v1}/boards`,
  BOARD: (id) => `${v1}/boards/${id}`,
  CATEGORIES: `${v1}/categories`,
  TAGS: `${v1}/tags`,
}
