import { call, put } from 'redux-saga/effects'

import boardService from '@/services/Board/Board.service'
import { loadBoardSuccess, loadBoardFail } from '@/store/board/board.slice'
import { loadCategoriesWorker } from '@/store/categories/categories.saga'
import { loadTagsWorker } from '@/store/tags/tags.saga'
import { loadMembersWorker } from '@/store/members/members.saga'
import { loadCardsWorker } from '@/store/cards/cards.saga'

export function* loadBoardWorker({ payload }) {
  try {
    const { data: board } = yield call(boardService.one, payload)
    yield call(loadCategoriesWorker, { payload })
    yield call(loadTagsWorker, { payload })
    if (board.members.length) {
      const userIds = board.members.map((m) => m.user_id)
      yield call(loadMembersWorker, { payload: userIds })
    }
    yield call(loadCardsWorker)
    yield put(loadBoardSuccess(board))
  } catch {
    yield put(loadBoardFail())
  }
}
