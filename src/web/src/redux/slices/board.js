import { createSlice } from '@reduxjs/toolkit'

import { toObject } from '../../utils/array_to_object'

export const initialState = {
  board: null,
  members: {},
  categories: [],
  tags: {},
  cards: [],
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
      state.board = payload.board
      state.members = toObject(payload.members, 'uuid')
      state.categories = payload.categories || []
      state.tags = toObject(payload.tags)
      state.cards = payload.cards || []
      state.loading = false
    },
    boardError: (state, { payload }) => {
      state.error = payload
      state.loading = false
    },
    boardClear: (state) => {
      state.board = null
      state.members = []
      state.categories = []
      state.tags = {}
      state.cards = {}
      state.error = ''
    },
    boardAddCategory: (state, { payload }) => {
      state.categories.push(payload)
    },
  },
})

export const { boardLoad, boardSuccess, boardError, boardClear, boardAddCategory } = boardSlice.actions

export default boardSlice.reducer
