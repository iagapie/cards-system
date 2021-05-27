// eslint-disable-next-line import/no-cycle
import { request } from '../utils/request'
import { ENDPOINTS } from './endpoints'

export const apiLogin = ({ email, password }) =>
  request('POST')(ENDPOINTS.AUTH.LOGIN)({
    data: {
      email,
      password,
    },
  })

export const apiRegistration = ({ name, email, password }) =>
  request('POST')(ENDPOINTS.AUTH.REGISTRATION)({
    data: {
      name,
      email,
      password,
      repeat_password: password,
    },
  })

export const apiRefreshToken = ({ token }) =>
  request('POST')(ENDPOINTS.AUTH.REFRESH)({
    data: {
      token,
    },
  })
