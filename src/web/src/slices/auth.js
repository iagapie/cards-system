import { createSlice } from '@reduxjs/toolkit'

const keyUser = 'auth.user'
const keyAuthenticated = 'auth.authenticated'

const setValue = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

const value = (key, initialValue) => {
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch {
    return initialValue
  }
}

export const initialState = {
  currentUser: value(keyUser, {}),
  isAuthenticated: value(keyAuthenticated, false),
  loading: false,
  error: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.loading = true
    },
    loginByToken: (state) => {
      state.loading = true
    },
    loginSuccess: (state, { payload }) => {
      state.currentUser = payload
      state.isAuthenticated = true
      state.loading = false
      setValue(keyUser, payload)
      setValue(keyAuthenticated, true)
    },
    loginError: (state, { payload }) => {
      state.error = payload
      state.isAuthenticated = false
      state.loading = false
      setValue(keyAuthenticated, false)
    },
    logout: (state) => {
      state.loading = true
    },
    logoutSuccess: (state) => {
      state.isAuthenticated = false
      state.currentUser = {}
      state.error = ''
      state.loading = false
      setValue(keyUser, {})
      setValue(keyAuthenticated, false)
    },
    registration: (state) => {
      state.loading = true
    },
    registrationError: (state, { payload }) => {
      state.error = payload
      state.loading = false
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
  loginByToken,
  loginSuccess,
  loginError,
  logout,
  logoutSuccess,
  registration,
  registrationError,
  clearError,
  noLoading,
} = authSlice.actions

export default authSlice.reducer
