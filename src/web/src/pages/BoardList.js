import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserIcon } from '@heroicons/react/outline'

import { getBoards } from '../redux/selectors'
import { boardsLoad, clearError } from '../redux/slices/boards'
import { Loader } from '../components/Loader'
import { DocumentTitle } from '../components/DocumentTitle'
import { BoardItem, NewBoard } from '../components/BoardList'

const BoardList = () => {
  const { boards, loading } = useSelector(getBoards)

  const canCreateBoard = useMemo(() => boards.length < 100, [boards])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(boardsLoad())

    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  return (
    <>
      <DocumentTitle title="Boards" />
      {loading ? (
        <Loader />
      ) : (
        <main className="overflow-x-hidden overflow-y-auto h-full bg-gray-100">
          <div className="flex flex-col w-full container mx-auto p-4 lg:p-14">
            <h3 className="flex items-center">
              <UserIcon className="w-6 h-6 text-blue-gray-600" />
              &nbsp;
              <span className="text-lg text-blue-gray-900 font-bold">Your Workspace boards</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4">
              {boards.map((board) => (
                <BoardItem key={board.id} board={board} />
              ))}
              {canCreateBoard && <NewBoard />}
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default BoardList
