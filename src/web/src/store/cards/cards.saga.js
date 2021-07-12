import { put, select } from 'redux-saga/effects'
import { v4 as uuid } from 'uuid'

import { getBoard, getCards, getCategories } from '@/store/selectors'
import { addCardSuccess, setCards, setLoading, setLoadingPosition } from '@/store/cards/cards.slice'
import { addError } from '@/store/notifications/notifications.slice'

export function* loadCardsWorker() {
  const { categories } = yield select(getCategories)

  if (categories.length) {
    const getRandomIntInclusive = (start, end) => {
      const min = Math.ceil(start)
      const max = Math.floor(end)

      return Math.floor(Math.random() * (max - min + 1)) + min
    }
    let index = 0
    const cards = categories.slice(0, categories.length - 1).reduce(
      (data, category) => [
        ...data,
        ...[...Array(getRandomIntInclusive(0, 50)).keys()].map((i) => ({
          id: uuid(),
          name: `Lorem ipsum dolor sit amet ${index++}.`,
          category_id: category.id,
          position: getRandomIntInclusive(-30, 40),
          created_at: '2021-06-25T00:23:13+03:00',
        })),
      ],
      [],
    )
    yield put(setCards(cards))
  }
}

export function* addCardWorker({ payload }) {
  try {
    const card = {
      id: uuid(),
      name: payload.name,
      category_id: payload.categoryId,
      position: payload.position,
      created_at: '2021-06-25T00:23:13+03:00',
    }
    yield put(addCardSuccess(card))
  } catch (error) {
    yield put(addError(error.message))
    yield put(setLoading(false))
  }
}

export function* updateCardPositionWorker({ payload }) {
  const { board } = yield select(getBoard)
  const { cards } = yield select(getCards)
  const oldCards = JSON.parse(JSON.stringify(cards))

  try {
    const newCards = JSON.parse(JSON.stringify(cards))
    const item = newCards[payload.source.droppableId].splice(payload.source.index, 1)
    newCards[payload.destination.droppableId].splice(payload.destination.index, 0, item[0])
    newCards[payload.destination.droppableId] = newCards[payload.destination.droppableId].map((item, i) => ({
      ...item,
      position: i,
    }))
    yield put(setCards(newCards))
  } catch (error) {
    yield put(addError(error.message))
    yield put(setCards(oldCards))
  }

  yield put(setLoadingPosition(false))
}
