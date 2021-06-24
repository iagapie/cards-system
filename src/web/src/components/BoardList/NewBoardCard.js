import { useDispatch } from 'react-redux'

import { setIsOpen } from '../../redux/slices/createBoard'

export const NewBoardCard = () => {
  const dispatch = useDispatch()

  const openCreateBoard = () => {
    dispatch(setIsOpen(true))
  }

  return (
    <button
      onClick={openCreateBoard}
      className="flex flex-col items-center justify-center h-28 rounded bg-gray-200 transition hover:bg-gray-300 hover:opacity-90 focus:outline-none"
    >
      <div className="text-base text-blue-gray-900">Create new board</div>
    </button>
  )
}
