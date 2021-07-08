import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

export class TagService {
  constructor(url) {
    this.url = url
  }

  list(params) {
    return request()(this.url.list)({
      headers: authorization(),
      params,
    })
  }
}

export default new TagService(endpoints.tag)
