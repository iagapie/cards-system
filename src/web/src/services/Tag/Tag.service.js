import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

class TagService {
  list(params) {
    return request()(endpoints.tag.list)({
      headers: authorization(),
      params,
    })
  }
}

export default new TagService()
