import { Suspense, lazy, useMemo } from 'react'
import { Switch, Route, useLocation } from 'react-router-dom'

import { PrivateRoute, PublicRoute } from '../components/Router'
import { ROUTES } from '../constants/routes'
import Header from '../components/Header'
import { Loader } from '../components/Loader'
import { NotFound } from './NotFound'
import { DocumentTitle } from '../components/DocumentTitle'
import { useSelector } from 'react-redux'
import { getBoard } from '../redux/selectors'
import { COLORS } from '../constants/colors'

const Home = lazy(() => import(/* webpackChunkName: "home" */ './Home'))
const Login = lazy(() => import(/* webpackChunkName: "login" */ './Login'))
const Registration = lazy(() => import(/* webpackChunkName: "registration" */ './Registration'))
const BoardList = lazy(() => import(/* webpackChunkName: "board-list" */ './BoardList'))
const Board = lazy(() => import(/* webpackChunkName: "board" */ './Board'))

const RootRouter = () => {
  const { pathname } = useLocation()
  const withHeader = ROUTES.ROOT !== pathname && ![ROUTES.AUTH.LOGIN, ROUTES.AUTH.REGISTRATION].includes(pathname)
  const { board } = useSelector(getBoard)
  const bg = useMemo(() => (board ? COLORS.BOARD.BG[board.color] : 'bg-sky-600'), [board])

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${bg}`}>
      <DocumentTitle />
      {withHeader && <Header />}
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path={ROUTES.ROOT}>
            <Home />
          </Route>
          <PublicRoute exact path={ROUTES.AUTH.LOGIN}>
            <Login />
          </PublicRoute>
          <PublicRoute exact path={ROUTES.AUTH.REGISTRATION}>
            <Registration />
          </PublicRoute>
          <PrivateRoute exact path={ROUTES.BOARD.LIST}>
            <BoardList />
          </PrivateRoute>
          <PrivateRoute exact path={ROUTES.BOARD.ONE()}>
            <Board />
          </PrivateRoute>
          <Route exact path={ROUTES.ERROR.NOT_FOUND}>
            <NotFound />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
    </div>
  )
}

export default RootRouter
