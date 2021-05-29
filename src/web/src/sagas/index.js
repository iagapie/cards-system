import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import {
  login,
  loginByToken,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
  registration,
  registrationError,
} from '../slices/auth'
import { apiMe } from '../api/user'
import { apiLogin, apiRegistration } from '../api/auth'
import { removeAccessTokens, setAccessTokens } from '../slices/token'
import { getToken } from '../selectors'

function* saveTokens(payload) {
  const data = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
  }
  yield put(setAccessTokens(data))
}

function* loginUser() {
  const { accessToken, refreshToken } = yield select(getToken)

  if (accessToken && refreshToken) {
    try {
      const { data } = yield call(apiMe, accessToken)
      yield put(loginSuccess(data))
    } catch (error) {
      yield put(removeAccessTokens())
      yield put(loginError(error.message))
    }
  } else {
    yield put(removeAccessTokens())
    yield put(logoutSuccess())
  }
}

function* authorize({ payload }) {
  try {
    const { data } = yield call(apiLogin, payload)
    yield call(saveTokens, data)
    yield call(loginUser)
  } catch (error) {
    yield put(loginError(error.message))
  }
}

function* logoutUser() {
  try {
    yield put(removeAccessTokens())
    yield put(logoutSuccess())
  } catch (error) {
    yield put(logoutSuccess())
  }
}

function* registrationUser({ payload }) {
  try {
    const { data } = yield call(apiRegistration, payload)
    yield call(saveTokens, data)
  } catch (error) {
    yield put(registrationError(error.message))
    return
  }
  yield call(loginUser)
}

function* rootSaga() {
  yield all([
    takeLatest(loginByToken.type, loginUser),
    takeLatest(login.type, authorize),
    takeLatest(logout.type, logoutUser),
    takeLatest(registration.type, registrationUser),
  ])
}

export default rootSaga
