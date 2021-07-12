import querystring from 'query-string'

import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

class CategoryService {
  list(params) {
    return request()(`${endpoints.category.list}?${querystring.stringify(params)}`)({
      headers: authorization(),
    })
  }

  create({ boardId, name, position }) {
    return request('POST')(endpoints.category.list)({
      headers: authorization(),
      data: {
        board_id: boardId,
        name,
        position,
      },
    })
  }

  updatePosition({ boardId, categories }) {
    return request('PATCH')(endpoints.category.list)({
      headers: authorization(),
      data: {
        board_id: boardId,
        categories,
      },
    })
  }
}

export default new CategoryService()
