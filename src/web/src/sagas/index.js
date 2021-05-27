import { all, call, put, takeLatest } from 'redux-saga/effects'

import {
  login,
  loginByToken,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
} from '../slices/auth'
import { removeTokens, rewriteTokens } from '../utils/tokens'
import { apiMe } from '../api/user'
import { apiLogin } from '../api/auth'

function* loginUser() {
  try {
    const { data } = yield call(apiMe)
    yield put(loginSuccess(data))
  } catch (error) {
    yield put(loginError(error.message))
  }
}

function* authorize(action) {
  try {
    const { data } = yield call(apiLogin, action.payload)
    yield call(rewriteTokens, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    })
    yield call(loginUser)
  } catch (error) {
    yield put(loginError(error.message))
  }
}

function* logoutUser() {
  try {
    removeTokens()
    yield put(logoutSuccess())
  } catch (error) {
    yield put(logoutSuccess())
  }
}

function* rootSaga() {
  yield all([
    takeLatest(loginByToken.type, loginUser),
    takeLatest(login.type, authorize),
    takeLatest(logout.type, logoutUser),
  ])
}

export default rootSaga
