import { call, put } from 'redux-saga/effects'

import userService from '@/services/User/User.service'
import { setMembers } from '@/store/members/members.slice'

export function* loadMembersWorker({ payload }) {
  const {
    data: { users },
  } = yield call(userService.list, { uuid: payload })
  yield put(setMembers(users))
}
