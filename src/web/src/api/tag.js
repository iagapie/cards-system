import { authorization, request } from '../utils/request'
import { ENDPOINTS } from '../constants/endpoints'

export const apiTags = (token, params) =>
  request()(ENDPOINTS.TAGS)({
    headers: authorization(token),
    params,
  })
