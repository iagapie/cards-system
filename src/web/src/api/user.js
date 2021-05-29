import { authorization, request } from '../utils/request'
import { ENDPOINTS } from './endpoints'

export const apiMe = (token) =>
  request()(ENDPOINTS.USER.ME)({
    headers: authorization(token),
  })
