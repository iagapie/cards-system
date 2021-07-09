import { useDispatch, useSelector } from 'react-redux'

import { getBoards } from '@/store/selectors'
import { addBoard, setModalIsOpen } from '@/store/boards/boards.slice'

import { BaseModal } from '../BaseModal'

import { AddBoardForm } from './AddBoardForm'

export const AddBoardModal = () => {
  const dispatch = useDispatch()
  const { modalIsOpen, modalLoading } = useSelector(getBoards)

  const onSubmit = (data) => {
    dispatch(addBoard(data))
  }

  const onClose = () => {
    dispatch(setModalIsOpen(false))
  }

  return (
    <BaseModal title="Create board" isOpen={modalIsOpen} onClose={onClose} overlayClose={false}>
      <div className="add-board">
        <AddBoardForm onSubmit={onSubmit} loading={modalLoading} />
      </div>
    </BaseModal>
  )
}
