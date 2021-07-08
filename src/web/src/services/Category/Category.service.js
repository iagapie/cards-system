import querystring from 'query-string'

import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

export class CategoryService {
  constructor(url) {
    this.url = url
  }

  list(params) {
    return request()(`${this.url.list}?${querystring.stringify(params)}`)({
      headers: authorization(),
    })
  }

  create({ boardId, name, position }) {
    return request('POST')(this.url.list)({
      headers: authorization(),
      data: {
        board_id: boardId,
        name,
        position,
      },
    })
  }
}

export default new CategoryService(endpoints.category)
