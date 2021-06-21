import { cloneElement } from 'react'
import PropTypes from 'prop-types'

export const HeaderButton = ({ icon, text, ...rest }) => (
  <button
    className="text-gray-50 text-base leading-4 font-bold p-1.5 flex items-center justify-center bg-white-30 rounded transition hover:bg-white-20 focus:outline-none"
    {...rest}
  >
    {cloneElement(icon, { className: 'h-5 w-5' })}
    {!!text && <span className="hidden md:ml-1.5 md:inline-block">{text}</span>}
  </button>
)

HeaderButton.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string,
}

HeaderButton.defaultProps = {
  text: '',
}
