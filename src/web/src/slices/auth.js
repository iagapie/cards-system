import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  currentUser: {},
  isAuthenticated: false,
  error: '',
  loading: false,
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
      state.error = ''
      state.loading = false
    },
    registration: (state) => {
      state.loading = true
    },
    registrationError: (state, { payload }) => {
      state.error = payload
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
} = authSlice.actions

export default authSlice.reducer
