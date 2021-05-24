import { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { getAuth } from '../selectors'
import { login } from '../slices/auth'
import HomePage from '../components/HomePage'

const App = () => {
  const { loading } = useSelector(getAuth)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(login())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Redirect to="/" />
    </Switch>
  )
}

export default App
