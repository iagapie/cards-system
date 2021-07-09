import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

class BoardService {
  list() {
    return request()(endpoints.board.list)({
      headers: authorization(),
    })
  }

  one(id) {
    return request()(endpoints.board.one(id))({
      headers: authorization(),
    })
  }

  create({ name, color, description }) {
    return request('POST')(endpoints.board.list)({
      headers: authorization(),
      data: {
        name,
        color,
        description,
      },
    })
  }

  update({ id, name, color, description }) {
    return request('PUT')(endpoints.board.one(id))({
      headers: authorization(),
      data: {
        name,
        color,
        description,
      },
    })
  }

  remove(id) {
    return request('DELETE')(endpoints.board.one(id))({
      headers: authorization(),
    })
  }
}

export default new BoardService()
