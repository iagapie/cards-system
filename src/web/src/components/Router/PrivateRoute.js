import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

import { getAuth } from '../../selectors'
import { ROUTES } from '../../constants/routes'

export const PrivateRoute = ({ children: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(getAuth)

  return (
    <Route
      render={() =>
        isAuthenticated ? Component : <Redirect to={ROUTES.AUTH.LOGIN} />
      }
      {...rest}
    />
  )
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}