import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  boards: [],
  loading: false,
  error: '',
}

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    boardsLoad: (state) => {
      state.loading = true
      state.error = ''
    },
    boardsSuccess: (state, { payload }) => {
      state.boards = payload
      state.loading = false
    },
    boardsAdd: (state, { payload }) => {
      state.boards.push(payload)
    },
    boardsReplace: (state, { payload }) => {
      const index = state.boards.findIndex((item) => item.id === payload.id)

      if (-1 !== index) {
        state.boards[index] = payload
      }
    },
    boardsDelete: (state, { payload }) => {
      const index = state.boards.findIndex((item) => item.id === payload)

      if (-1 !== index) {
        state.boards.splice(index, 1)
      }
    },
    boardsError: (state, { payload }) => {
      state.error = payload
      state.loading = false
    },
    clearError: (state) => {
      state.error = ''
    },
  },
})

export const { boardsLoad, boardsSuccess, boardsAdd, boardsReplace, boardsDelete, boardsError, clearError } =
  boardsSlice.actions

export default boardsSlice.reducer
