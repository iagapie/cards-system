import { call, put } from 'redux-saga/effects'

import { routes } from '@/utils/constants'
import history from '@/utils/history'
import boardService from '@/services/Board/Board.service'
import { addBoardSuccess, loadBoardsSuccess, setBoardsLoading } from '@/store/boards/boards.slice'
import { addError } from '@/store/notifications/notifications.slice'

export function* loadBoardsWorker() {
  try {
    const { data } = yield call(boardService.list)
    yield put(loadBoardsSuccess(data.boards))
  } catch (error) {
    yield put(addError({ message: error.message }))
    yield put(setBoardsLoading(false))
  }
}

export function* addBoardWorker({ payload }) {
  try {
    const { headers } = yield call(boardService.create, payload)
    const id = headers['location'].split('/').pop()
    const { data } = yield call(boardService.one, id)
    yield put(addBoardSuccess(data))
    history.push(routes.board.one(id))
  } catch (error) {
    yield put(addError(error.message))
  }
}
