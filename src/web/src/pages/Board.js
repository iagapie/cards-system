import { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getBoard, getBoardCategories } from '../redux/selectors'
import { DocumentTitle } from '../components/DocumentTitle'
import { Loader } from '../components/Loader'
import { Category } from '../components/Board/Category'
import { boardClear, boardLoad } from '../redux/slices/board'
import { AddCategory } from '../components/Board/AddCategory'
import { NotFound } from './NotFound'
import { Header } from '../components/Board/Header'

const Board = () => {
  const { boardId } = useParams()
  const { board, members, loading, error } = useSelector(getBoard)
  const categories = useSelector(getBoardCategories)
  const title = useMemo(() => (board ? board.name : 'Board'), [board])
  const canAddCategory = useMemo(() => categories.length < 50, [categories])
  const position = useMemo(
    () => (categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories],
  )

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(boardLoad(boardId))

    return () => {
      dispatch(boardClear())
    }
  }, [boardId, dispatch])

  return (
    <>
      {error ? (
        <NotFound />
      ) : (
        <>
          <DocumentTitle title={title} />
          {loading ? (
            <Loader />
          ) : (
            <>
              {board && (
                <main className="flex flex-col space-y-2.5 p-2.5 min-h-screen overflow-hidden">
                  <Header members={members} board={board} />
                  <div className="grid grid-flow-col auto-cols-max gap-2 overflow-y-hidden overflow-x-auto">
                    {categories.map((category) => (
                      <Category key={category.id} category={category} />
                    ))}
                    {canAddCategory && <AddCategory boardId={board.id} position={position} />}
                  </div>
                </main>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default Board
