import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './auth'
import tokenReducer from './token'

const rootReducer = combineReducers({
  authState: authReducer,
  tokenState: tokenReducer,
})

export default rootReducer
