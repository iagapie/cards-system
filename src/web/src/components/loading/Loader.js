import { PlusIcon } from '@heroicons/react/outline'
import PropTypes from 'prop-types'

export const Loader = ({ color }) => (
  <div className="loader" data-theme={color}>
    <div className="loader__xl" />
    <div className="loader__lg" />
    <div className="loader__md" />
    <div className="loader__add">
      <PlusIcon className="loader__icon" />
      &nbsp;
      <span>Add another list</span>
    </div>
    <span className="loader__loading">Loading...</span>
  </div>
)

Loader.propTypes = {
  color: PropTypes.string.isRequired,
}

Loader.defaultProps = {
  color: 'sky',
}
