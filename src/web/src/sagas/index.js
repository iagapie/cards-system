import { all, put, takeLatest } from 'redux-saga/effects'

import {
  login,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
} from '../slices/auth'

function* loginUser() {
  try {
    // TODO
    // const { data } = yield axios('/api/auth/login')
    // yield put(loginSuccess(data))
    yield put(loginSuccess({ name: 'Demo User' }))
  } catch (error) {
    yield put(loginError(error.message))
  }
}

function* logoutUser() {
  try {
    // TODO
    // yield axios('/api/auth/logout')

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
