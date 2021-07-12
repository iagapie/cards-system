import { request } from '@/utils/request'
import { endpoints } from '@/utils/constants'

class AuthService {
  login({ email, password }) {
    return request('POST')(endpoints.auth.login)({
      data: {
        email,
        password,
      },
    })
  }

  registration({ name, email, password }) {
    return request('POST')(endpoints.auth.registration)({
      data: {
        name,
        email,
        password,
        repeat_password: password,
      },
    })
  }
}

export default new AuthService()
