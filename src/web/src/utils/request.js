import axios from 'axios'

import history from './history'
import { store } from '../redux/store'
import { API_URL, ENDPOINTS } from '../constants/endpoints'
import { ROUTES } from '../constants/routes'
import { removeAccessTokens, setAccessTokens, setCsrf } from '../redux/slices/token'
import { getToken } from '../redux/selectors'

const csrfHeader = 'x-csrf-token'
const bearer = (token) => `Bearer ${token}`

const isCsrfMethod = (method) => {
  const methods = ['post', 'put', 'patch', 'delete', 'trace']
  return methods.indexOf(method.toLowerCase()) !== -1
}

const setCsrfToken = (data) => {
  const response = data.response || data
  const headers = response.headers || {}
  if (headers[csrfHeader]) {
    store.dispatch(setCsrf(headers[csrfHeader]))
  }
  return data
}

const setCsrfHeader = (config) => {
  const { csrf } = getToken(store.getState())
  if (!!csrf && isCsrfMethod(config.method)) {
    return {
      ...config,
      headers: { ...config.headers, [csrfHeader]: csrf },
    }
  }
  return config
}

export const authorization = (accessToken) => ({
  Authorization: bearer(accessToken),
})

export const fetch = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

fetch.interceptors.request.use(setCsrfHeader)

const refresh = (token, error) =>
  fetch
    .post(ENDPOINTS.AUTH.REFRESH, { token })
    .then((response) => {
      const accessToken = response.data.access_token
      store.dispatch(
        setAccessTokens({
          accessToken,
          refreshToken: response.data.refresh_token,
        }),
      )
      const config = {
        ...error.response.config,
        headers: {
          ...error.response.config.headers,
          Authorization: bearer(accessToken),
        },
      }
      return fetch(config)
    })
    .catch((err) => {
      store.dispatch(removeAccessTokens())
      history.push(ROUTES.AUTH.LOGIN)
      return Promise.reject(err)
    })

const createResponseInterceptor = () => {
  const interceptor = fetch.interceptors.response.use(setCsrfToken, (error) => {
    setCsrfToken(error)

    const { refreshToken } = getToken(store.getState())

    if (error?.response?.status === 401 && refreshToken) {
      fetch.interceptors.response.eject(interceptor)
      return refresh(refreshToken, error).finally(createResponseInterceptor)
    }

    if (error?.response?.status === 403) {
      fetch.interceptors.response.eject(interceptor)
      return fetch(error.response.config).finally(createResponseInterceptor)
    }

    return Promise.reject(error)
  })
}

createResponseInterceptor()

const executor = (config) => (resolve, reject) => {
  fetch(config)
    .then(resolve)
    .catch((error) => reject(error?.response?.data ?? error?.response))
}

// prettier-ignore
export const request = (method = 'GET') => (url) => ({ headers, params, data } = {}) => {
  const config = { method, url, headers, params, data }
  return new Promise(executor(config))
}
