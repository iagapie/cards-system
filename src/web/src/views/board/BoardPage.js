import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { PageTitle } from '@/components/helmet/PageTitle'
import { Loading } from '@/components/loading/Loading'
import NotFoundPage from '@/views/notFound/NotFoundPage'
import { canAddCategory, getBoard, getCategories, getMembers } from '@/store/selectors'
import { clearBoard, loadBoard } from '@/store/board/board.slice'

import { BoardHeader } from './BoardHeader'
import { BoardCategory } from './BoardCategory'
import { BoardAddCategory } from './BoardAddCategory'
import { BoardMenu } from './BoardMenu'

const BoardPage = () => {
  const { boardId } = useParams()
  const { board, loading, notFound } = useSelector(getBoard)
  const { categories } = useSelector(getCategories)
  const { members } = useSelector(getMembers)
  const canCreateCategory = useSelector(canAddCategory)

  const title = useMemo(() => (board ? board.name : 'Board'), [board])
  const position = useMemo(
    () => (categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories],
  )

  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadBoard(boardId))

    return () => {
      dispatch(clearBoard())
    }
  }, [boardId, dispatch])

  return (
    <>
      {notFound ? (
        <NotFoundPage />
      ) : (
        <>
          <PageTitle title={title} />
          {loading ? (
            <Loading />
          ) : (
            <>
              {board && (
                <main className="board-page">
                  <Helmet htmlAttributes={{ 'data-theme': board.color }} />
                  <BoardHeader board={board} members={members} isOpen={isOpen} onOpen={onOpen} />
                  <div className="board-page__wrapper">
                    <div className="board-page__categories">
                      {categories.map((category) => (
                        <BoardCategory
                          key={category.id}
                          category={category}
                          color={board.color}
                          className="board-page__category"
                        />
                      ))}
                      {canCreateCategory && (
                        <div className="board-page__category">
                          <BoardAddCategory boardId={boardId} color={board.color} position={position} />
                        </div>
                      )}
                    </div>
                  </div>
                  <BoardMenu color={board.color} onClose={onClose} isOpen={isOpen} />
                </main>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default BoardPage
