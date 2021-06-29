import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  currentUser: value(keyUser, {}),
  isAuthenticated: value(keyAuthenticated, false),
  accessToken: '',
  refreshToken: '',
  csrf: '',
  loading: false,
  error: '',
}

const authSlice = createSlice({
  name: 'auth',
})
