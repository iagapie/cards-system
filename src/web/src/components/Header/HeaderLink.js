import { cloneElement } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export const HeaderLink = ({ icon, to, text, ...rest }) => (
  <Link to={to} className="btn-white-30 font-bold" {...rest}>
    {cloneElement(icon, { className: 'h-5 w-5' })}
    {!!text && <span className="hidden md:inline-block">{text}</span>}
  </Link>
)

HeaderLink.propTypes = {
  icon: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
  text: PropTypes.string,
}

HeaderLink.defaultProps = {
  text: '',
}
