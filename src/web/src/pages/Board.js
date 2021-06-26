import { memo, useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { getBoard, getBoardCategories } from '../redux/selectors'
import { DocumentTitle } from '../components/DocumentTitle'
import { Loader } from '../components/Loader'
import { Category } from '../components/Board/Category'
import * as boardSlice from '../redux/slices/board'
import { AddCategory } from '../components/Board/AddCategory'
import { NotFound } from './NotFound'
import { Header } from '../components/Board/Header'
import { CustomDragLayer } from '../components/Board/CustomDragLayer'
import { useBoardState } from '../contexts/BoardStateContext'
import { Menu } from '../components/Board/Menu'

const isDebug = process.env.NODE_ENV !== 'production'

const Board = memo(() => {
  const { boardId } = useParams()
  const { openingMenu, setOpeningMenu } = useBoardState()
  const { board, members, loading, error } = useSelector(getBoard)
  const categories = useSelector(getBoardCategories)
  const title = useMemo(() => (board ? board.name : 'Board'), [board])
  const canAddCategory = useMemo(() => categories.length < 50, [categories])
  const position = useMemo(
    () => (categories && categories.length > 0 ? categories[categories.length - 1].position + 1 : 0),
    [categories],
  )

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(boardSlice.load(boardId))

    return () => {
      dispatch(boardSlice.clear())
    }
  }, [boardId, dispatch])

  const moveCategory = useCallback(
    (dragIndex, hoverIndex) => {
      dispatch(boardSlice.moveCategories({ dragIndex, hoverIndex }))
    },
    [dispatch],
  )

  const closeMenu = () => setOpeningMenu(false)

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
                <DndProvider debugMode={isDebug} backend={HTML5Backend}>
                  <main className="flex flex-row w-full h-full overflow-hidden relative">
                    <div className="flex-grow flex flex-col space-y-2.5 p-2.5 h-full overflow-hidden">
                      <Header members={members} board={board} />
                      <div className="grid grid-flow-col auto-cols-max gap-2 overflow-y-hidden overflow-x-auto z-0">
                        {categories.map((category, index) => (
                          <Category key={category.id} index={index} category={category} moveCategory={moveCategory} />
                        ))}
                        {canAddCategory && <AddCategory boardId={board.id} position={position} color={board.color} />}
                      </div>
                      <CustomDragLayer />
                    </div>
                    <Menu isOpen={openingMenu} closeMenu={closeMenu} bgColor={board.color} />
                  </main>
                </DndProvider>
              )}
            </>
          )}
        </>
      )}
    </>
  )
})

export default Board
