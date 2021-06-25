import querystring from 'query-string'

import { authorization, request } from '../utils/request'
import { ENDPOINTS } from '../constants/endpoints'

export const apiMe = (token) =>
  request()(ENDPOINTS.ME)({
    headers: authorization(token),
  })

export const apiUsers = (token, params) =>
  request()(`${ENDPOINTS.USERS}?${querystring.stringify(params)}`)({
    headers: authorization(token),
  })
