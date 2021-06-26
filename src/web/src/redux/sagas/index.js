import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import { apiMe, apiUsers } from '../../api/user'
import { apiLogin, apiRegistration } from '../../api/auth'
import { apiBoards, apiCreateBoard, apiGetBoard } from '../../api/board'
import { removeAccessTokens, setAccessTokens } from '../slices/token'
import { getToken, getAuth } from '../selectors'
import history from '../../utils/history'
import { ROUTES } from '../../constants/routes'
import {
  login,
  loginByToken,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
  registration,
  registrationError,
  noLoading,
} from '../slices/auth'
import { boardsAdd, boardsError, boardsLoad, boardsSuccess } from '../slices/boards'
import * as boardSlice from '../slices/board'
import { createBoard, createBoardError, createBoardSuccess } from '../slices/createBoard'
import { apiCategories, apiCreateCategory } from '../../api/category'
import { apiTags } from '../../api/tag'
import { createCategory, createCategoryError, createCategorySuccess } from '../slices/createCategory'

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
    const { isAuthenticated } = yield select(getAuth)

    if (isAuthenticated) {
      yield put(noLoading())
    } else {
      try {
        const { data } = yield call(apiMe, accessToken)
        yield put(loginSuccess(data))
      } catch (error) {
        yield put(removeAccessTokens())
        yield put(loginError(error.message))
      }
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
  history.push(ROUTES.AUTH.LOGIN)
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

function* fetchBoards() {
  const { accessToken } = yield select(getToken)

  try {
    const { data } = yield call(apiBoards, accessToken)
    yield put(boardsSuccess(data.boards))
  } catch (error) {
    yield put(boardsError(error.message))
  }
}

function* fetchBoard({ payload }) {
  const { accessToken } = yield select(getToken)

  try {
    const { data: board } = yield call(apiGetBoard, accessToken, payload)
    yield put(boardSlice.setBoard(board))

    const {
      data: { categories },
    } = yield call(apiCategories, accessToken, { board: payload })
    yield put(boardSlice.setCategories(categories))

    const {
      data: { tags },
    } = yield call(apiTags, accessToken, { board: payload })
    yield put(boardSlice.setTags(tags))

    if (board.members.length > 0) {
      const userIds = board.members.map((m) => m.user_id)
      const {
        data: { users },
      } = yield call(apiUsers, accessToken, { uuid: userIds })
      yield put(boardSlice.setMembers(users))
    }

    // TODO: get cards
    if (categories.length) {
      const getRandomIntInclusive = (start, end) => {
        const min = Math.ceil(start)
        const max = Math.floor(end)
        return Math.floor(Math.random() * (max - min + 1)) + min
      }
      let index = 0
      const cards = categories.slice(0, categories.length - 1).reduce(
        (data, category) => [
          ...data,
          ...[...Array(getRandomIntInclusive(0, 50)).keys()].map((i) => ({
            id: `card${index++}`,
            name: `Lorem ipsum dolor sit amet ${index}.`,
            category_id: category.id,
            position: getRandomIntInclusive(-30, 40),
            created_at: '2021-06-25T00:23:13+03:00',
          })),
        ],
        [],
      )
      yield put(boardSlice.setCards(cards))
    }

    yield put(boardSlice.success())
  } catch (error) {
    yield put(boardSlice.setError(error.message))
  }
}

function* addBoard({ payload }) {
  const { accessToken } = yield select(getToken)

  try {
    const { headers } = yield call(apiCreateBoard, accessToken, payload)
    const id = headers['location'].split('/').pop()
    const { data } = yield call(apiGetBoard, accessToken, id)
    yield put(boardsAdd(data))
    yield put(createBoardSuccess())
    history.push(ROUTES.BOARD.ONE(id))
  } catch (error) {
    yield put(createBoardError(error.message))
  }
}

function* addCategory({ payload }) {
  const { accessToken } = yield select(getToken)

  try {
    const { headers } = yield call(apiCreateCategory, accessToken, payload)
    const id = headers['location'].split('/').pop()
    const { data } = yield call(apiCategories, accessToken, { board: payload.boardId, category: id })
    yield put(boardSlice.addCategory(data.categories[0]))
    yield put(createCategorySuccess())
  } catch (error) {
    yield put(createCategoryError(error.message))
  }
}

function* rootSaga() {
  yield all([
    takeLatest(loginByToken.type, loginUser),
    takeLatest(login.type, authorize),
    takeLatest(logout.type, logoutUser),
    takeLatest(registration.type, registrationUser),
    takeLatest(boardsLoad.type, fetchBoards),
    takeLatest(boardSlice.load.type, fetchBoard),
    takeLatest(createBoard.type, addBoard),
    takeLatest(createCategory.type, addCategory),
  ])
}

export default rootSaga
