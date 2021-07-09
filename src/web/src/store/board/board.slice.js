import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  board: null,
  loading: false,
  notFound: false,
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    loadBoard: (state) => {
      state.loading = true
    },
    loadBoardSuccess: (state, { payload }) => {
      state.board = payload
      state.loading = false
    },
    loadBoardFail: (state) => {
      state.notFound = true
      state.loading = false
    },
    clearBoard: (state) => {
      state.board = null
      state.loading = false
      state.notFound = false
    },
  },
})

export const { loadBoard, loadBoardSuccess, loadBoardFail, clearBoard } = boardSlice.actions

export default boardSlice.reducer
