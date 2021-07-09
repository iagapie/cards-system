import { createSlice } from '@reduxjs/toolkit'

import { toObject } from '@/utils/helpers'

const initialState = {
  tags: {},
  loading: false,
}

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setTags: (state, { payload }) => {
      state.tags = toObject(payload)
    },
    addTag: (state) => {
      state.loading = true
    },
    addTagSuccess: (state, { payload }) => {
      state.tags[payload.id] = payload
      state.loading = false
    },
    updateTag: (state) => {
      state.loading = true
    },
    updateTagSuccess: (state, { payload }) => {
      state.tags[payload.id] = payload
      state.loading = false
    },
    removeTag: (state) => {
      state.loading = true
    },
    removeTagSuccess: (state, { payload }) => {
      const id = typeof payload === 'string' ? payload : payload.id
      delete state.tags[id]
      state.loading = false
    },
    setLoading: (state, { payload }) => {
      state.loading = !!payload
    },
  },
})

export const { setTags, addTag, addTagSuccess, updateTag, updateTagSuccess, removeTag, removeTagSuccess, setLoading } =
  tagsSlice.actions

export default tagsSlice.reducer
