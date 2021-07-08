import { combineReducers } from '@reduxjs/toolkit'

import authReducer from './authentication/authentication.slice'

const rootReducer = combineReducers({
  authState: authReducer,
})

export default rootReducer
