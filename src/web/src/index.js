import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'

import App from './containers/App'
import rootReducer from './slices'
import history from './utils/history'

import '@/styles/index.scss'

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware({ thunk: false })],
  devTools: process.env.NODE_ENV !== 'production',
})

render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
