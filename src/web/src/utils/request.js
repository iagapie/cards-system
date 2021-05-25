import axios from 'axios'
import { getRefreshToken, getToken, rewriteTokens } from './tokens'
import { API_URL } from '../api/endpoints'
// eslint-disable-next-line import/no-cycle
import { apiRefreshToken } from '../api/auth'
import history from './history'
import { ROUTES } from '../constants/routes'

export const authorization = {
  Authorization: `Bearer ${getToken()}`,
}

export const fetch = axios.create({
  baseURL: API_URL,
})

const reload = () => window.location.reload()

const refresh = () =>
  apiRefreshToken({ token: getRefreshToken() })
    .then((response) => {
      const { accessToken, refreshToken } = response.data
      rewriteTokens({ accessToken, refreshToken })
    })
    .catch((error) => {
      history.push(ROUTES.AUTH.LOGIN)
      return error
    })

const error = (reject) => (err) => {
  if (err?.response?.status === 401) {
    refresh().then(reload).catch(reject)
    return
  }
  reject(err.response?.data ?? err.response)
}

const executor = (config) => (resolve, reject) => {
  fetch(config).then(resolve).catch(error(reject))
}

export const request =
  (method = 'GET') =>
  (url) =>
  ({ headers, params, data } = {}) => {
    const config = { method, url, headers, params, data }
    return new Promise(executor(config))
  }
