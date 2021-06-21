import PropTypes from 'prop-types'
import { PlusIcon } from '@heroicons/react/outline'

export const Loading = ({ containerClass, itemClass, newClass, textClass }) => (
  <div className={`loading ${containerClass}`}>
    <div className={`loading__item h-10 ${itemClass}`} />
    <div className={`loading__item h-6 ${itemClass}`} />
    <div className={`loading__item h-3 ${itemClass}`} />
    <div className={`loading__new ${newClass}`}>
      <PlusIcon className="w-1 h-1" />
      &nbsp;
      <span>Add another list</span>
    </div>
    <span className={`loading__text ${textClass}`}>Loading...</span>
  </div>
)

Loading.propTypes = {
  containerClass: PropTypes.string,
  itemClass: PropTypes.string,
  newClass: PropTypes.string,
  textClass: PropTypes.string,
}

Loading.defaultProps = {
  containerClass: 'bg-sky-600',
  itemClass: 'bg-gray-200',
  newClass: 'bg-white-30 text-gray-50',
  textClass: 'text-gray-50',
}
