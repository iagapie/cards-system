import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  isOpen: false,
  loading: false,
  error: '',
}

const createBoardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    createBoard: (state) => {
      state.loading = true
      state.error = ''
    },
    createBoardSuccess: (state) => {
      state.loading = false
      state.isOpen = false
    },
    createBoardError: (state, { payload }) => {
      state.error = payload
      state.loading = false
    },
    setIsOpen: (state, { payload }) => {
      if (!payload) {
        if (state.loading) {
          return
        }
        state.error = ''
      }
      state.isOpen = payload
    },
    clearBoardError: (state) => {
      state.error = ''
    },
  },
})

export const { createBoard, createBoardSuccess, createBoardError, setIsOpen, clearBoardError } =
  createBoardSlice.actions

export default createBoardSlice.reducer
