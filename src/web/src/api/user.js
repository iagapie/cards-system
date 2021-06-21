import { authorization, request } from '../utils/request'
import { ENDPOINTS } from '../constants/endpoints'

export const apiMe = (token) =>
  request()(ENDPOINTS.USER.ME)({
    headers: authorization(token),
  })
