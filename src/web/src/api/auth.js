import { request } from '../utils/request'
import { ENDPOINTS } from '../constants/endpoints'

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
