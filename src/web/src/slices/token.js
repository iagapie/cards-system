import { createSlice } from '@reduxjs/toolkit'
import {
  getToken,
  getRefreshToken,
  removeTokens,
  rewriteTokens,
} from '../utils/cookie_tokens'

export const initialState = {
  accessToken: getToken() || '',
  refreshToken: getRefreshToken() || '',
  csrf: '',
}

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setAccessTokens: (state, { payload }) => {
      state.accessToken = payload.accessToken
      state.refreshToken = payload.refreshToken
      rewriteTokens(payload)
    },
    removeAccessTokens: (state) => {
      state.accessToken = ''
      state.refreshToken = ''
      removeTokens()
    },
    setCsrf: (state, { payload }) => {
      state.csrf = payload
    },
  },
})

export const { setAccessTokens, removeAccessTokens, setCsrf } =
  tokenSlice.actions

export default tokenSlice.reducer
