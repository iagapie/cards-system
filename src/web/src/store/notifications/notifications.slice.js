import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

const dismiss = 4000 // 4s

export const NotifyType = Object.freeze({
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
})

const normalize = (notification) => {
  const type = notification.type || NotifyType.info
  const title = type.charAt(0).toUpperCase() + type.slice(1)

  return { id: uuid(), title, type, dismiss, ...notification }
}

const initialState = {
  notifications: [], // { id, title, type: NotifyType, dismiss: < 1 for infinite, message }
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, { payload }) => {
      state.notifications.unshift(normalize(payload))
    },
    addSuccess: (state, { payload }) => {
      state.notifications.unshift(normalize({ type: NotifyType.success, ...payload }))
    },
    addWarning: (state, { payload }) => {
      state.notifications.unshift(normalize({ type: NotifyType.warning, ...payload }))
    },
    addError: (state, { payload }) => {
      state.notifications.unshift(normalize({ type: NotifyType.error, ...payload }))
    },
    removeNotification: (state, { payload }) => {
      const id = typeof payload === 'string' ? payload : payload.id
      const index = state.notifications.findIndex((item) => item.id === id)
      if (index !== -1) {
        state.notifications.splice(index, 1)
      }
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, addSuccess, addWarning, addError, removeNotification, clearNotifications } =
  notificationsSlice.actions

export default notificationsSlice.reducer
