import { cloneElement } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

export const HeaderLink = ({ icon, to, text, ...rest }) => (
  <Link
    to={to}
    className="text-gray-50 text-base leading-4 font-bold p-1.5 flex items-center justify-center rounded bg-white-30 transition hover:bg-white-20"
    {...rest}
  >
    {cloneElement(icon, { className: 'h-5 w-5' })}
    {!!text && <span className="hidden md:ml-1.5 md:inline-block">{text}</span>}
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
