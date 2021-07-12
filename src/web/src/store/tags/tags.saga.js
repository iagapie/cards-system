import { call, put } from 'redux-saga/effects'

import tagService from '@/services/Tag/Tag.service'
import { setTags } from '@/store/tags/tags.slice'

export function* loadTagsWorker({ payload }) {
  const {
    data: { tags },
  } = yield call(tagService.list, { board: payload })
  yield put(setTags(tags))
}
