export const ROUTES = {
  ROOT: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTRATION: '/signup',
    FORGOT_PASSWORD: '/forgot',
  },
  BOARD: {
    LIST: '/boards',
    ONE: (id = ':boardId') => `/boards/${id}`,
  },
  ERROR: {
    NOT_FOUND: '/404',
  },
}
