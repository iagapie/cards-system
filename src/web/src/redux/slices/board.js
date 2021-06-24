import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  board: null,
  loading: false,
  error: '',
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    boardLoad: (state) => {
      state.loading = true
      state.error = ''
    },
    boardSuccess: (state, { payload }) => {
      state.board = payload
      state.loading = false
    },
    boardError: (state, { payload }) => {
      state.error = payload
      state.loading = false
    },
    boardClear: (state) => {
      state.board = null
      state.error = ''
    },
  },
})

export const { boardLoad, boardSuccess, boardError, boardClear } = boardSlice.actions

export default boardSlice.reducer
