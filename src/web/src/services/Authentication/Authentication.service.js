import { request } from '@/utils/request'
import { endpoints } from '@/utils/constants'

export class AuthService {
  constructor(url) {
    this.url = url
  }

  login({ email, password }) {
    return request('POST')(this.url.login)({
      data: {
        email,
        password,
      },
    })
  }

  registration({ name, email, password }) {
    return request('POST')(this.url.registration)({
      data: {
        name,
        email,
        password,
        repeat_password: password,
      },
    })
  }
}

export default new AuthService(endpoints.auth)
