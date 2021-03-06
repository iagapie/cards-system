import { call, put, select } from 'redux-saga/effects'

import categoryService from '@/services/Category/Category.service'
import { addCategorySuccess, setCategories, setLoading, setLoadingPosition } from '@/store/categories/categories.slice'
import { addError } from '@/store/notifications/notifications.slice'
import { getBoard, getCategories } from '@/store/selectors'

export function* loadCategoriesWorker({ payload }) {
  const {
    data: { categories },
  } = yield call(categoryService.list, { board: payload })
  yield put(setCategories(categories))
}

export function* addCategoryWorker({ payload }) {
  try {
    const { headers } = yield call(categoryService.create, payload)
    const id = headers['location'].split('/').pop()
    const {
      data: { categories },
    } = yield call(categoryService.list, { board: payload.boardId, category: id })
    yield put(addCategorySuccess(categories[0]))
  } catch (error) {
    yield put(addError(error.message))
    yield put(setLoading(false))
  }
}

export function* updateCategoryPositionWorker({ payload }) {
  const { board } = yield select(getBoard)
  const { categories } = yield select(getCategories)
  const oldCats = categories.slice()

  try {
    let newCats = categories.slice()
    newCats.splice(payload.source.index, 1)
    newCats.splice(payload.destination.index, 0, oldCats[payload.source.index])
    newCats = newCats.map((c, i) => ({ ...c, position: i }))

    yield put(setCategories(newCats))
    yield call(categoryService.updatePosition, {
      boardId: board.id,
      categories: newCats.map((c) => ({ id: c.id, position: c.position })),
    })
  } catch (error) {
    yield put(addError(error.message))
    yield put(setCategories(oldCats))
  }

  yield put(setLoadingPosition(false))
}
