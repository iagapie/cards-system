import { createSlice } from '@reduxjs/toolkit'

import { toObject } from '@/utils/helpers'

const initialState = {
  members: {},
  loading: false,
}

const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, { payload }) => {
      state.members = toObject(payload, 'uuid')
    },
    setLoading: (state, { payload }) => {
      state.loading = !!payload
    },
  },
})

export const { setMembers, setLoading } = membersSlice.actions

export default membersSlice.reducer
