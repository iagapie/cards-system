import { all, call, put, takeLatest } from 'redux-saga/effects'

import {
  login,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
} from '../slices/auth'
import { removeTokens } from '../utils/tokens'
import { apiMe } from '../api/user'

function* loginUser() {
  try {
    const { data } = yield call(apiMe)
    yield put(loginSuccess(data))
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
    takeLatest(login.type, loginUser),
    takeLatest(logout.type, logoutUser),
  ])
}

export default rootSaga
