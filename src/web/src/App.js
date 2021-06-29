import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { Suspense, lazy, useState } from 'react'
import { ThemeProvider } from 'styled-components'

import history from '@/utils/history'
import { PageTitle } from '@/components/helmet/PageTitle/PageTitle'
import { routes } from '@/utils/constants'
import NotFoundPage from '@/views/notFound/NotFound/NotFoundPage'
import { Header } from '@/components/layout/header/Header/Header'
import { Theme } from '@/theme/Theme'
import { ThemeContainer } from '@/components/layout/container/ThemeContainer/ThemeContainer.styles'
import { BoardStateProvider } from '@/contexts/BoardStateContext'
import { Loader } from '@/components/loading/Loader/Loader'

const HomePage = lazy(() => import(/* webpackChunkName: "home" */ './views/home/HomePage/HomePage'))
const LoginPage = lazy(() => import(/* webpackChunkName: "login" */ './views/login/LoginPage/LoginPage'))
const RegistrationPage = lazy(() =>
  import(/* webpackChunkName: "registration" */ './views/registration/RegistrationPage/RegistrationPage'),
)
const BoardsPage = lazy(() => import(/* webpackChunkName: "boards" */ './views/boards/BoardsPage/BoardsPage'))
const BoardPage = lazy(() => import(/* webpackChunkName: "board" */ './views/board/BoardPage/BoardPage'))

export const App = () => {
  const [background, setBackground] = useState(Theme.background)

  return (
    <Router history={history}>
      <PageTitle />
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route exact path={routes.root}>
            {/*<HomePage />*/}
            <Redirect to={routes.board.list} />
          </Route>
          <Route exact path={routes.auth.login}>
            <LoginPage />
          </Route>
          <Route exact path={routes.auth.registration}>
            <RegistrationPage />
          </Route>
          <Route path={routes.board.list}>
            <ThemeProvider theme={{ background, setBackground }}>
              <BoardStateProvider>
                <ThemeContainer>
                  <Header />
                  <Suspense fallback={<Loader />}>
                    <Switch>
                      <Route exact path={routes.board.list}>
                        <BoardsPage />
                      </Route>
                      <Route exact path={routes.board.one()}>
                        <BoardPage />
                      </Route>
                      <Route path="*">
                        <NotFoundPage />
                      </Route>
                    </Switch>
                  </Suspense>
                </ThemeContainer>
              </BoardStateProvider>
            </ThemeProvider>
          </Route>
          <Route exact path={routes.error.notFound}>
            <NotFoundPage />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  )
}
