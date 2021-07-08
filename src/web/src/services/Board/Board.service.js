import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

export class BoardService {
  constructor(url) {
    this.url = url
  }

  list() {
    return request()(this.url.list)({
      headers: authorization(),
    })
  }

  one(id) {
    return request()(this.url.one(id))({
      headers: authorization(),
    })
  }

  create({ name, color, description }) {
    return request('POST')(this.url.list)({
      headers: authorization(),
      data: {
        name,
        color,
        description,
      },
    })
  }

  update({ id, name, color, description }) {
    return request('PUT')(this.url.one(id))({
      headers: authorization(),
      data: {
        name,
        color,
        description,
      },
    })
  }

  remove(id) {
    return request('DELETE')(this.url.one(id))({
      headers: authorization(),
    })
  }
}

export default new BoardService(endpoints.board)
