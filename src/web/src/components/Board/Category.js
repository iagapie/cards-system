import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DotsHorizontalIcon, PlusIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

import { getBoardCardsByCategory } from '../../redux/selectors'

export const Category = ({ category }) => {
  const boardCardsByCategory = useMemo(getBoardCardsByCategory, [])
  const cards = useSelector((state) => boardCardsByCategory(state, category.id))

  return (
    <div className="flex flex-col justify-start overflow-hidden">
      <div className="flex flex-col space-y-2 w-64 p-2 bg-gray-200 rounded shadow-sm overflow-hidden">
        <div className="pl-2 flex items-center justify-between">
          <h2 className="text-black-100 text-sm font-bold leading-4 truncate overflow-hidden">{category.name}</h2>
          <button className="flex items-center justify-center p-2 text-sm leading-4 text-blue-gray-500 rounded transition hover:bg-gray-300 hover:text-black-100 focus:outline-none">
            <DotsHorizontalIcon className="w-4 h-4" />
          </button>
        </div>
        {cards.length > 0 && (
          <div className="grid grid-flow-row gap-2 overflow-y-auto">
            {cards.map((c) => (
              <div
                key={c}
                className="p-2 shadow-sm border-b border-gray-400 text-black-100 text-sm leading-4 rounded bg-gray-100 transition hover:bg-gray-50 cursor-pointer"
              >
                Lorem ipsum dolor sit amet.
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <button className="flex-1 flex items-center px-3 py-2 text-sm leading-4 text-blue-gray-500 rounded transition hover:bg-gray-300 hover:text-blue-gray-700 focus:outline-none">
            <PlusIcon className="w-4 h-4" />
            <span className="pl-2">{cards.length ? 'Add another card' : 'Add a card'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
}
