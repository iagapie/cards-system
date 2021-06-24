import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './auth'
import tokenReducer from './token'
import boardsReducer from './boards'
import boardReducer from './board'
import createBoardReducer from './createBoard'

const rootReducer = combineReducers({
  authState: authReducer,
  tokenState: tokenReducer,
  boardsState: boardsReducer,
  boardState: boardReducer,
  createBoardState: createBoardReducer,
})

export default rootReducer
