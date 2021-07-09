import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserIcon } from '@heroicons/react/outline'

import { PageTitle } from '@/components/helmet/PageTitle'
import { Loading } from '@/components/loading/Loading'
import { canAddBoard, getBoards } from '@/store/selectors'
import { loadBoards, setModalIsOpen } from '@/store/boards/boards.slice'

import { BoardListItem } from './BoardListItem'

const BoardListPage = () => {
  const dispatch = useDispatch()
  const { boards, loading } = useSelector(getBoards)
  const canCreateBoard = useSelector(canAddBoard)

  const onOpen = () => {
    dispatch(setModalIsOpen(true))
  }

  useEffect(() => {
    if (boards.length === 0) {
      dispatch(loadBoards())
    }
  }, [boards.length, dispatch])

  return (
    <>
      <PageTitle title="Boards" />
      {loading ? (
        <Loading />
      ) : (
        <main className="boards-page">
          <div className="boards-page__container">
            <h1 className="boards-page__title">
              <UserIcon className="boards-page__icon" />
              Your Workspace boards
            </h1>
            <div className="boards-page__list">
              {boards.map((board) => (
                <BoardListItem key={board.id} board={board} />
              ))}
              {canCreateBoard && (
                <button className="boards-page__new-item" onClick={onOpen}>
                  Create new board
                </button>
              )}
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default BoardListPage
