import { Suspense } from 'react'
import {
  useRouteMatch,
  useParams,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'

import { Loader } from '../../components/Loader'
import { ROUTES } from '../../constants/routes'

const Space = () => {
  const { spaceId } = useParams()
  return <h3>Requested topic ID: {spaceId}</h3>
}

const SpaceRouter = () => {
  const match = useRouteMatch()

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path={`${match.path}/add`}>
          <h1>Space Add Page</h1>
        </Route>
        <Route exact path={`${match.path}/:spaceId`}>
          <Space />
        </Route>
        <Route exact path={match.path}>
          <h1>Space List Page</h1>
        </Route>
        <Route path="*">
          <Redirect to={ROUTES.ERROR.NOT_FOUND} />
        </Route>
      </Switch>
    </Suspense>
  )
}

export default SpaceRouter
