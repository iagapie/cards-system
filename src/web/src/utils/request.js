import axios from 'axios'

import { store } from '@/store'
import { getAuth } from '@/store/selectors'
import { setCsrf, setTokens, clearAuth } from '@/store/authentication/authentication.slice'

import history from './history'
import { apiUrl, endpoints, routes } from './constants'

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
  const { csrf } = getAuth(store.getState())
  if (!!csrf && isCsrfMethod(config.method)) {
    return {
      ...config,
      headers: { ...config.headers, [csrfHeader]: csrf },
    }
  }

  return config
}

export const authorization = () => {
  const { accessToken } = getAuth(store.getState())

  return {
    Authorization: bearer(accessToken),
  }
}

export const fetch = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
})

fetch.interceptors.request.use(setCsrfHeader)

const refresh = (token, error) =>
  fetch
    .post(endpoints.auth.refresh, { token })
    .then((response) => {
      const accessToken = response.data.access_token
      store.dispatch(
        setTokens({
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
      store.dispatch(clearAuth())
      history.push(routes.auth.login)

      return Promise.reject(err)
    })

const createResponseInterceptor = () => {
  const interceptor = fetch.interceptors.response.use(setCsrfToken, (error) => {
    setCsrfToken(error)

    const { refreshToken } = getAuth(store.getState())

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
