import { Suspense } from 'react'
import {
  useRouteMatch,
  useParams,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Loader } from '../../components/Loader'
import { ROUTES } from '../../constants/routes'
import { logout } from '../../slices/auth'
import { getAuth } from '../../selectors'

const Board = () => {
  const { boardId } = useParams()
  return <h3>Requested topic ID: {boardId}</h3>
}

const BoardRouter = () => {
  const { currentUser } = useSelector(getAuth)
  const match = useRouteMatch()
  const dispatch = useDispatch()

  const signOut = () => {
    dispatch(logout())
  }

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route exact path={`${match.path}/add`}>
          <h1>Board Add Page</h1>
        </Route>
        <Route exact path={`${match.path}/:boardId`}>
          <Board />
        </Route>
        <Route exact path={match.path}>
          <h1>Board List Page</h1>
          <h3>
            {currentUser.name} &#60;{currentUser.email}&#62;
          </h3>
          <button type="button" onClick={signOut}>
            Logout
          </button>
        </Route>
        <Route path="*">
          <Redirect to={ROUTES.ERROR.NOT_FOUND} />
        </Route>
      </Switch>
    </Suspense>
  )
}

export default BoardRouter