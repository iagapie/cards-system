import { Router, Switch, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

import history from '@/utils/history'
import { routes } from '@/utils/constants'
import { NotificationContainer } from '@/components/notifications/NotificationContainer'
import { Header } from '@/components/header/Header'
import { Loading } from '@/components/loading/Loading'
import { PageTitle } from '@/components/helmet/PageTitle'
import { PublicRoute } from '@/components/routing/PublicRoute'
import { PrivateRoute } from '@/components/routing/PrivateRoute'
import NotFoundPage from '@/views/notFound/NotFoundPage'

const HomePage = lazy(() => import(/* webpackChunkName: "home" */ '@/views/home/HomePage'))
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ '@/views/login/LoginPage'))
const RegistrationPage = lazy(() =>
  import(/* webpackChunkName: "registration" */ '@/views/registration/RegistrationPage'),
)
const BoardListPage = lazy(() => import(/* webpackChunkName: "boardList" */ '@/views/boardList/BoardListPage'))
const BoardPage = lazy(() => import(/* webpackChunkName: "board" */ '@/views/board/BoardPage'))

export const App = () => (
  <Router history={history}>
    <PageTitle />
    <NotificationContainer />
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={routes.root}>
          <HomePage />
        </Route>
        <PublicRoute exact path={routes.auth.login}>
          <LoginPage />
        </PublicRoute>
        <PublicRoute exact path={routes.auth.registration}>
          <RegistrationPage />
        </PublicRoute>
        <PrivateRoute path={routes.board.list}>
          <Header />
          <Suspense fallback={<Loading />}>
            <Switch>
              <Route exact path={routes.board.list}>
                <BoardListPage />
              </Route>
              <Route exact path={routes.board.one()}>
                <BoardPage />
              </Route>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Switch>
          </Suspense>
        </PrivateRoute>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </Suspense>
  </Router>
)
