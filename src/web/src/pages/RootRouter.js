import { Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ROUTES } from '../constants/routes'
import { Loader } from '../components/Loader'
import { DocumentTitle } from '../components/DocumentTitle'
import { ErrorWrapper } from '../components/ErrorWrapper'
import { PrivateRoute } from '../components/Router'

const Home = lazy(() => import(/* webpackChunkName: "home" */ './Home'))
const Login = lazy(() => import(/* webpackChunkName: "login" */ './Auth/Login'))
const Registration = lazy(() =>
  import(/* webpackChunkName: "registration" */ './Auth/Registration'),
)
const Verification = lazy(() =>
  import(/* webpackChunkName: "verification" */ './Auth/Verification'),
)
const SpaceRouter = lazy(() =>
  import(/* webpackChunkName: "spaceRouter" */ './Space/SpaceRouter'),
)

const RootRouter = () => (
  <Suspense fallback={<Loader />}>
    <DocumentTitle />
    <Switch>
      <Route exact path={ROUTES.ROOT}>
        <Home />
      </Route>
      <Route exact path={ROUTES.AUTH.LOGIN}>
        <Login />
      </Route>
      <Route exact path={ROUTES.AUTH.REGISTRATION}>
        <Registration />
      </Route>
      <Route exact path={ROUTES.AUTH.VERIFICATION}>
        <Verification />
      </Route>
      <PrivateRoute path={ROUTES.SPACE.HOME}>
        <SpaceRouter />
      </PrivateRoute>
      <Route exact path={ROUTES.ERROR.NOT_FOUND}>
        <ErrorWrapper text="404 Page not found" />
      </Route>
      <Route path="*">
        <Redirect to={ROUTES.ERROR.NOT_FOUND} />
      </Route>
    </Switch>
  </Suspense>
)

export default RootRouter
