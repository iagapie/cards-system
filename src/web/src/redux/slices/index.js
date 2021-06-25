import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './auth'
import tokenReducer from './token'
import boardsReducer from './boards'
import boardReducer from './board'
import createBoardReducer from './createBoard'
import createCategoryReducer from './createCategory'

const rootReducer = combineReducers({
  authState: authReducer,
  tokenState: tokenReducer,
  boardsState: boardsReducer,
  boardState: boardReducer,
  createBoardState: createBoardReducer,
  createCategoryState: createCategoryReducer,
})

export default rootReducer
