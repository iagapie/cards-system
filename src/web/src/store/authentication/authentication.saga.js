import { call, put } from 'redux-saga/effects'

import { routes } from '@/utils/constants'
import history from '@/utils/history'
import authService from '@/services/Authentication/Authentication.service'
import userService from '@/services/User/User.service'
import { loginSuccess, setCurrentUser, setTokens, clearAuth } from '@/store/authentication/authentication.slice'
import { addError } from '@/store/notifications/notifications.slice'

function* fetchTokens(service, payload) {
  const { data: tokens } = yield call(service, payload)
  yield put(setTokens({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token }))
}

function* fetchCurrentUser() {
  const { data: currentUser } = yield call(userService.me)
  yield put(setCurrentUser(currentUser))
}

function* authWorker(service, payload) {
  try {
    yield call(fetchTokens, service, payload)
    yield call(fetchCurrentUser)
    yield put(loginSuccess())
  } catch (error) {
    yield put(addError({ message: error.message }))
    yield put(clearAuth())
  }
}

export function* loginWorker({ payload }) {
  yield call(authWorker, authService.login, payload)
}

export function* logoutWorker() {
  yield put(clearAuth())
  history.push(routes.auth.login)
}

export function* registrationWorker({ payload }) {
  yield call(authWorker, authService.registration, payload)
}
