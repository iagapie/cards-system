import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserIcon } from '@heroicons/react/outline'

import { getBoards } from '../redux/selectors'
import { boardsLoad, clearError } from '../redux/slices/boards'
import { Loader } from '../components/Loader'
import { DocumentTitle } from '../components/DocumentTitle'
import { BoardCard, NewBoardCard } from '../components/BoardList'

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

  // let boards = [
  //   {
  //     id: 'board1',
  //     name: 'Books',
  //     color: 'sky',
  //   },
  //   {
  //     id: 'board2',
  //     name: 'Finance planning',
  //     color: 'indigo',
  //   },
  //   {
  //     id: 'board3',
  //     name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus asperiores aut consectetur culpa dolor dolorem, impedit magnam perferendis placeat sint ullam vel velit! Ducimus eius modi quam ut! Placeat.',
  //     color: 'red',
  //   },
  //   {
  //     id: 'board4',
  //     name: 'Lorem ipsum dolor sit amet',
  //     color: 'yellow',
  //   },
  //   {
  //     id: 'board5',
  //     name: 'Books',
  //     color: 'sky',
  //   },
  //   {
  //     id: 'board6',
  //     name: 'Finance planning',
  //     color: 'indigo',
  //   },
  //   {
  //     id: 'board7',
  //     name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus asperiores aut consectetur culpa dolor dolorem, impedit magnam perferendis placeat sint ullam vel velit! Ducimus eius modi quam ut! Placeat.',
  //     color: 'red',
  //   },
  //   {
  //     id: 'board8',
  //     name: 'Lorem ipsum dolor sit amet',
  //     color: 'yellow',
  //   },
  //   {
  //     id: 'board1',
  //     name: 'Books',
  //     color: 'sky',
  //   },
  //   {
  //     id: 'board2',
  //     name: 'Finance planning',
  //     color: 'indigo',
  //   },
  //   {
  //     id: 'board3',
  //     name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus asperiores aut consectetur culpa dolor dolorem, impedit magnam perferendis placeat sint ullam vel velit! Ducimus eius modi quam ut! Placeat.',
  //     color: 'red',
  //   },
  //   {
  //     id: 'board4',
  //     name: 'Lorem ipsum dolor sit amet',
  //     color: 'yellow',
  //   },
  //   {
  //     id: 'board5',
  //     name: 'Books',
  //     color: 'sky',
  //   },
  //   {
  //     id: 'board6',
  //     name: 'Finance planning',
  //     color: 'indigo',
  //   },
  //   {
  //     id: 'board7',
  //     name: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus asperiores aut consectetur culpa dolor dolorem, impedit magnam perferendis placeat sint ullam vel velit! Ducimus eius modi quam ut! Placeat.',
  //     color: 'red',
  //   },
  //   {
  //     id: 'board8',
  //     name: 'Lorem ipsum dolor sit amet',
  //     color: 'yellow',
  //   },
  // ]

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
                <BoardCard key={board.id} board={board} />
              ))}
              {canCreateBoard && <NewBoardCard />}
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default BoardList
