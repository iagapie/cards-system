import { cloneElement } from 'react'
import PropTypes from 'prop-types'

export const HeaderButton = ({ icon, text, ...rest }) => (
  <button className="btn-white-30" {...rest}>
    {cloneElement(icon, { className: 'h-5 w-5' })}
    {!!text && <span className="hidden md:inline-block">{text}</span>}
  </button>
)

HeaderButton.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string,
}

HeaderButton.defaultProps = {
  text: '',
}
