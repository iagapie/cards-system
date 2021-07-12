import { createSlice } from '@reduxjs/toolkit'

import { findIndex } from '@/utils/helpers'

const remove = (state, payload) => {
  const index = findIndex(state.boards, payload)
  if (index !== -1) {
    state.boards.splice(index, 1)
  }
}

const initialState = {
  boards: [],
  loading: false,
  modalIsOpen: false,
  modalLoading: false,
}

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    addBoard: (state) => {
      state.modalLoading = true
    },
    addBoardSuccess: (state, { payload }) => {
      state.boards.unshift(payload)
      state.modalLoading = false
      state.modalIsOpen = false
    },
    updateBoard: (state, { payload }) => {
      remove(state, payload)
      state.boards.unshift(payload)
    },
    removeBoard: (state, { payload }) => {
      remove(state, payload)
    },
    loadBoards: (state) => {
      state.loading = true
    },
    loadBoardsSuccess: (state, { payload }) => {
      state.boards = payload || []
      state.loading = false
    },
    setBoardsLoading: (state, { payload }) => {
      state.loading = !!payload
    },
    setModalIsOpen: (state, { payload }) => {
      state.modalIsOpen = !!payload
    },
    setModalLoading: (state, { payload }) => {
      state.modalLoading = !!payload
    },
  },
})

export const {
  addBoard,
  addBoardSuccess,
  updateBoard,
  removeBoard,
  loadBoards,
  loadBoardsSuccess,
  setBoardsLoading,
  setModalIsOpen,
  setModalLoading,
} = boardsSlice.actions

export default boardsSlice.reducer
