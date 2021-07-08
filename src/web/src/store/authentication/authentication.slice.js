import { createSlice } from '@reduxjs/toolkit'

import LocalStorageService from '@/services/LocalStorage/LocalStorage.service'
import CookiesService from '@/services/Cookies/Cookies.service'

const keyUser = 'auth.user'
const keyTokens = 'tokens'

const currentUser = LocalStorageService.get(keyUser, {})
const { accessToken, refreshToken } = CookiesService.get(keyTokens, { accessToken: '', refreshToken: '' })

export const initialState = {
  currentUser,
  isAuthenticated: Object.keys(currentUser).length !== 0,
  accessToken,
  refreshToken,
  csrf: '',
  loading: false,
  error: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.loading = true
      state.error = ''
    },
    loginSuccess: (state, { payload }) => {
      const { currentUser, accessToken, refreshToken } = payload
      state.currentUser = currentUser
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.isAuthenticated = true
      state.loading = false
      LocalStorageService.set(keyUser, currentUser)
      CookiesService.set(keyTokens, { accessToken, refreshToken })
    },
    loginError: (state, { payload }) => {
      state.error = payload
      state.isAuthenticated = false
      state.loading = false
    },
    logout: (state) => {
      state.loading = true
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false
      state.currentUser = {}
      state.accessToken = ''
      state.refreshToken = ''
      state.error = ''
      state.loading = false
      LocalStorageService.remove(keyUser)
      CookiesService.remove(keyTokens)
    },
    rewriteTokens: (state, { payload }) => {
      const { accessToken, refreshToken } = payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      CookiesService.set(keyTokens, payload)
    },
    registration: (state) => {
      state.loading = true
    },
    registrationError: (state, { payload }) => {
      state.error = payload
      state.loading = false
    },
    setCsrf: (state, { payload }) => {
      state.csrf = payload
    },
    clearError: (state) => {
      state.error = ''
    },
    noLoading: (state) => {
      state.loading = false
    },
  },
})

export const {
  login,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
  rewriteTokens,
  registration,
  registrationError,
  setCsrf,
  clearError,
  noLoading,
} = authSlice.actions

export default authSlice.reducer
