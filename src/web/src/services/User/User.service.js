import querystring from 'query-string'

import { request, authorization } from '@/utils/request'
import { endpoints } from '@/utils/constants'

class UserService {
  me() {
    return request()(endpoints.user.me)({
      headers: authorization(),
    })
  }

  list(params) {
    return request()(`${endpoints.user.list}?${querystring.stringify(params)}`)({
      headers: authorization(),
    })
  }
}

export default new UserService()
