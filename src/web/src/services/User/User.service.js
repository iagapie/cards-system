import querystring from 'query-string'

import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

export class UserService {
  constructor(url) {
    this.url = url
  }

  me() {
    return request()(this.url.me)({
      headers: authorization(),
    })
  }

  list(params) {
    return request()(`${this.url.list}?${querystring.stringify(params)}`)({
      headers: authorization(),
    })
  }
}

export default new UserService(endpoints.user)
