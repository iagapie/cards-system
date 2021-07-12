import { createSlice } from '@reduxjs/toolkit'

import localStorageService from '@/services/LocalStorage/LocalStorage.service'
import cookiesService from '@/services/Cookies/Cookies.service'

const keyUser = 'auth.user'
const keyTokens = 'tokens'

const currentUser = localStorageService.get(keyUser, {})
const { accessToken, refreshToken } = cookiesService.get(keyTokens, { accessToken: '', refreshToken: '' })
const isAuthenticated = Object.keys(currentUser).length !== 0 && !!accessToken && !!refreshToken

const initialState = {
  currentUser: isAuthenticated ? currentUser : {},
  isAuthenticated,
  accessToken: isAuthenticated ? accessToken : '',
  refreshToken: isAuthenticated ? refreshToken : '',
  csrf: '',
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.loading = true
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true
      state.loading = false
    },
    logout: (state) => {
      state.loading = true
    },
    registration: (state) => {
      state.loading = true
    },
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload
      localStorageService.set(keyUser, payload)
    },
    setTokens: (state, { payload }) => {
      const { accessToken, refreshToken } = payload
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      cookiesService.set(keyTokens, payload)
    },
    setCsrf: (state, { payload }) => {
      state.csrf = payload
    },
    clearAuth: (state) => {
      state.isAuthenticated = false
      state.currentUser = {}
      state.accessToken = ''
      state.refreshToken = ''
      state.loading = false
      localStorageService.remove(keyUser)
      cookiesService.remove(keyTokens)
    },
  },
})

export const { login, loginSuccess, logout, registration, setCurrentUser, setTokens, setCsrf, clearAuth } =
  authSlice.actions

export default authSlice.reducer
