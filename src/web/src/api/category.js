import querystring from 'query-string'

import { authorization, request } from '../utils/request'
import { ENDPOINTS } from '../constants/endpoints'

export const apiCategories = (token, params) =>
  request()(`${ENDPOINTS.CATEGORIES}?${querystring.stringify(params)}`)({
    headers: authorization(token),
  })

export const apiCreateCategory = (token, { boardId, name, position }) =>
  request('POST')(ENDPOINTS.CATEGORIES)({
    headers: authorization(token),
    data: {
      board_id: boardId,
      name,
      position,
    },
  })
