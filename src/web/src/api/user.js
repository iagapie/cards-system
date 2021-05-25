import { authorization, request } from '../utils/request'
import { ENDPOINTS } from './endpoints'

export const apiMe = () =>
  request()(ENDPOINTS.USER.ME)({
    headers: authorization,
  })
