import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { isProduction } from '@/utils/constants'

import rootReducer from './rootReducer'

export const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: rootReducer,
  middleware: [sagaMiddleware, ...getDefaultMiddleware({ thunk: false })],
  devTools: !isProduction,
})
