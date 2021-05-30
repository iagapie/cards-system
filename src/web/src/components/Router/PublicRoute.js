import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { getAuth } from '../../selectors'
import { ROUTES } from '../../constants/routes'

export const PublicRoute = ({ children: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(getAuth)

  return (
    <Route
      render={() =>
        !isAuthenticated ? Component : <Redirect to={ROUTES.BOARD.HOME} />
      }
      {...rest}
    />
  )
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
