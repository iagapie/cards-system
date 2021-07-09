import { createSlice } from '@reduxjs/toolkit'

import { findIndex, groupBy, orderBy } from '@/utils/helpers'

const add = (data, payload) => {
  if (data[payload.category_id]) {
    data[payload.category_id].push(payload)
  } else {
    data[payload.category_id] = [payload]
  }

  return data
}

const initialState = {
  cards: {},
  loading: false,
}

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCards: (state, { payload }) => {
      state.cards = groupBy(orderBy(payload), 'category_id')
    },
    addCard: (state) => {
      state.loading = true
    },
    addCardSuccess: (state, { payload }) => {
      state.cards = add(state.cards, payload)
      state.loading = false
    },
    updateCard: (state) => {
      state.loading = true
    },
    updateCardSuccess: (state, { payload }) => {
      const [categoryId, cardIndex] = findIndex(state.cards, payload)
      if (cardIndex !== -1) {
        state.cards[categoryId].splice(cardIndex, 1)
      }
      state.cards = add(state.cards, payload)
      state.cards[payload.category_id] = orderBy(state.cards[payload.category_id])
      state.loading = false
    },
    removeCard: (state) => {
      state.loading = true
    },
    removeCardSuccess: (state, { payload }) => {
      const [categoryId, cardIndex] = findIndex(state.cards, payload)
      if (cardIndex !== -1) {
        state.cards[categoryId].splice(cardIndex, 1)
      }
      state.loading = false
    },
    removeByCategoryId: (state, { payload }) => {
      delete state.cards[payload]
    },
    setLoading: (state, { payload }) => {
      state.loading = !!payload
    },
  },
})

export const {
  setCards,
  addCard,
  addCardSuccess,
  updateCard,
  updateCardSuccess,
  removeCard,
  removeCardSuccess,
  removeByCategoryId,
  setLoading,
} = cardsSlice.actions

export default cardsSlice.reducer
