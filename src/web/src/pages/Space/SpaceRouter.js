import { Suspense } from 'react'
import { useRouteMatch, useParams, Switch, Route } from 'react-router-dom'

import { Loader } from '../../components/Loader'

const Space = () => {
  const { spaceId } = useParams()
  return <h3>Requested topic ID: {spaceId}</h3>
}

const SpaceRouter = () => {
  const match = useRouteMatch()

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path={`${match.path}/add`}>
          <h1>Space Add Page</h1>
        </Route>
        <Route path={`${match.path}/:spaceId`}>
          <Space />
        </Route>
        <Route path={match.path}>
          <h1>Space List Page</h1>
        </Route>
      </Switch>
    </Suspense>
  )
}

export default SpaceRouter
