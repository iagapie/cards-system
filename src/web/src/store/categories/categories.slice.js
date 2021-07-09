import { createSlice } from '@reduxjs/toolkit'

import { findIndex, orderBy } from '@/utils/helpers'

const initialState = {
  categories: [],
  loading: false,
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, { payload }) => {
      state.categories = orderBy(payload)
    },
    addCategory: (state) => {
      state.loading = true
    },
    addCategorySuccess: (state, { payload }) => {
      state.categories.push(payload)
      state.loading = false
    },
    updateCategory: (state) => {
      state.loading = true
    },
    updateCategorySuccess: (state, { payload }) => {
      const index = findIndex(state.categories, payload)
      if (index !== -1) {
        state.categories.splice(index, 1, payload)
        state.categories = orderBy(state.categories)
      }
      state.loading = false
    },
    removeCategory: (state) => {
      state.loading = true
    },
    removeCategorySuccess: (state, { payload }) => {
      const index = findIndex(state.categories, payload)
      if (index !== -1) {
        state.categories.splice(index, 1)
      }
      state.loading = false
    },
    setLoading: (state, { payload }) => {
      state.loading = !!payload
    },
  },
})

export const {
  setCategories,
  addCategory,
  addCategorySuccess,
  updateCategory,
  updateCategorySuccess,
  removeCategory,
  removeCategorySuccess,
  setLoading,
} = categoriesSlice.actions

export default categoriesSlice.reducer
