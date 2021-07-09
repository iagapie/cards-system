import { call, put } from 'redux-saga/effects'

import categoryService from '@/services/Category/Category.service'
import { addCategorySuccess, setCategories, setLoading } from '@/store/categories/categories.slice'
import { addError } from '@/store/notifications/notifications.slice'

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
