import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  loading: false,
  error: '',
}

const createCategorySlice = createSlice({
  name: 'createCategory',
  initialState,
  reducers: {
    createCategory: (state) => {
      state.loading = true
      state.error = ''
    },
    createCategorySuccess: (state) => {
      state.loading = false
    },
    createCategoryError: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

export const { createCategory, createCategorySuccess, createCategoryError } = createCategorySlice.actions

export default createCategorySlice.reducer
