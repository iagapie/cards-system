import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  board: null,
  members: {},
  categories: [],
  tags: {},
  cards: {},
  loading: false,
  error: '',
}

const toObject = (data, key = 'id') =>
  Array.isArray(data) ? data.reduce((obj, item) => ({ ...obj, [item[key]]: item }), {}) : {}

const orderBy = (data) => {
  if (!data) {
    return []
  }
  const tmp = data.slice()
  tmp.sort((a, b) => {
    if (a.position === b.position) {
      const ad = new Date(a.created_at)
      const bd = new Date(b.created_at)

      if (ad > bd) {
        return 1
      }

      if (ad < bd) {
        return -1
      }

      return 0
    }

    return a.position - b.position
  })
  return tmp
}

const moveByPosition = (data, dragIndex, hoverIndex) => {
  const temp = data.slice()

  temp[dragIndex] = { ...temp[dragIndex], position: temp[hoverIndex].position }

  if (dragIndex > hoverIndex) {
    for (let i = hoverIndex; i < temp.length; i++) {
      if (i === dragIndex) {
        continue
      }
      temp[i] = { ...temp[i], position: temp[i].position + 1 }
    }
  } else {
    for (let i = hoverIndex; i >= 0; i--) {
      if (i === dragIndex) {
        continue
      }
      temp[i] = { ...temp[i], position: temp[i].position - 1 }
    }
  }

  return temp
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    load: (state) => {
      state.loading = true
      state.error = ''
    },
    success: (state, { payload }) => {
      state.loading = false
    },
    setError: (state, { payload }) => {
      state.error = payload
      state.loading = false
    },
    setBoard: (state, { payload }) => {
      state.board = payload
    },
    setMembers: (state, { payload }) => {
      state.members = toObject(payload, 'uuid')
    },
    setCategories: (state, { payload }) => {
      state.categories = orderBy(payload)
    },
    setTags: (state, { payload }) => {
      state.tags = toObject(payload)
    },
    setCards: (state, { payload }) => {
      state.cards = payload || []
    },
    clear: (state) => {
      state.board = null
      state.members = []
      state.categories = []
      state.tags = {}
      state.cards = []
      state.error = ''
    },
    addCategory: (state, { payload }) => {
      state.categories.push(payload)
    },
    moveCategories: (state, { payload }) => {
      const { dragIndex, hoverIndex } = payload
      const categories = moveByPosition(state.categories, dragIndex, hoverIndex)
      state.categories = orderBy(categories)
    },
    moveCards: (state, { payload }) => {
      const { dragCard, hoverCard } = payload

      const dragIndex = state.cards.findIndex((item) => item.id === dragCard.id)
      const hoverIndex = state.cards.findIndex((item) => item.id === hoverCard.id)

      state.cards[dragIndex].old_category_id = state.cards[dragIndex].category_id
      state.cards[dragIndex].category_id = state.cards[hoverIndex].category_id

      state.cards = moveByPosition(state.cards, dragIndex, hoverIndex)
    },
    moveCard: (state, { payload }) => {
      const { cardId, categoryId, position } = payload
      const index = state.cards.findIndex((item) => item.id === cardId)
      state.cards[index].old_category_id = state.cards[index].category_id
      state.cards[index].category_id = categoryId
      state.cards[index].position = position
    },
  },
})

export const {
  load,
  success,
  setError,
  setBoard,
  setMembers,
  setCategories,
  setTags,
  setCards,
  clear,
  addCategory,
  moveCategories,
  moveCards,
  moveCard,
} = boardSlice.actions

export default boardSlice.reducer
