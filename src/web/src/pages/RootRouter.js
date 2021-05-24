import { Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ROUTES } from '../constants/routes'
import { Loader } from '../components/Loader'
import { DocumentTitle } from '../components/DocumentTitle'
import { ErrorWrapper } from '../components/ErrorWrapper'

const Home = lazy(() => import(/* webpackChunkName: "home" */ './Home'))

const RootRouter = () => (
  <Suspense fallback={<Loader />}>
    <DocumentTitle />
    <Switch>
      <Route exact path={ROUTES.ROOT}>
        <Home />
      </Route>
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
