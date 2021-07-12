import { combineReducers } from '@reduxjs/toolkit'

import notificationsReducer from './notifications/notifications.slice'
import authReducer from './authentication/authentication.slice'
import boardsReducer from './boards/boards.slice'
import boardReducer from './board/board.slice'
import cardsReducer from './cards/cards.slice'
import membersReducer from './members/members.slice'
import categoriesReducer from './categories/categories.slice'
import tagsReducer from './tags/tags.slice'

const currentBoardReducer = combineReducers({
  boardState: boardReducer,
  cardsState: cardsReducer,
  membersState: membersReducer,
  categoriesState: categoriesReducer,
  tagsState: tagsReducer,
})

const rootReducer = combineReducers({
  notificationsState: notificationsReducer,
  authState: authReducer,
  boardsState: boardsReducer,
  currentBoardState: currentBoardReducer,
})

export default rootReducer
