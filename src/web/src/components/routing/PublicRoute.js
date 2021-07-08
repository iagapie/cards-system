import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import { routes } from '@/utils/constants'
import { getAuth } from '@/store/selectors'

export const PublicRoute = ({ children: Component, ...rest }) => {
  const { isAuthenticated } = useSelector(getAuth)

  return <Route render={() => (!isAuthenticated ? Component : <Redirect to={routes.board.list} />)} {...rest} />
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
