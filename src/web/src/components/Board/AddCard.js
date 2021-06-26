import { PlusIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

export const AddCard = ({ label, categoryId, position }) => (
  <div className="flex items-center justify-between">
    <button className="flex-1 flex items-center px-3 py-2 text-sm leading-4 text-blue-gray-500 rounded transition hover:bg-gray-300 hover:text-blue-gray-700 focus:outline-none">
      <PlusIcon className="w-4 h-4" />
      <span className="pl-2">{label}</span>
    </button>
  </div>
)

AddCard.propTypes = {
  label: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
}
