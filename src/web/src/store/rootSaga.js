import { all, takeLatest } from 'redux-saga/effects'

import { login, logout, registration } from '@/store/authentication/authentication.slice'
import { loginWorker, logoutWorker, registrationWorker } from '@/store/authentication/authentication.saga'
import { addBoard, loadBoards } from '@/store/boards/boards.slice'
import { addBoardWorker, loadBoardsWorker } from '@/store/boards/boards.saga'
import { loadBoard } from '@/store/board/board.slice'
import { loadBoardWorker } from '@/store/board/board.saga'
import { addCategory, updateCategoryPosition } from '@/store/categories/categories.slice'
import { addCategoryWorker, updateCategoryPositionWorker } from '@/store/categories/categories.saga'
import { addCard, updateCardPosition } from '@/store/cards/cards.slice'
import { addCardWorker, updateCardPositionWorker } from '@/store/cards/cards.saga'

function* rootSaga() {
  yield all([
    takeLatest(login.type, loginWorker),
    takeLatest(logout.type, logoutWorker),
    takeLatest(registration.type, registrationWorker),
    takeLatest(loadBoards.type, loadBoardsWorker),
    takeLatest(loadBoard.type, loadBoardWorker),
    takeLatest(addBoard.type, addBoardWorker),
    takeLatest(addCategory.type, addCategoryWorker),
    takeLatest(addCard.type, addCardWorker),
    takeLatest(updateCategoryPosition.type, updateCategoryPositionWorker),
    takeLatest(updateCardPosition.type, updateCardPositionWorker),
  ])
}

export default rootSaga
