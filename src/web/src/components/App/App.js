import { useEffect } from 'react'
import { Router } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import history from '../../utils/history'
import RootRouter from '../../pages/RootRouter'
import { Loader } from '../Loader'
import { getAuth } from '../../redux/selectors'
import { loginByToken } from '../../redux/slices/auth'

export const App = () => {
  const { loading } = useSelector(getAuth)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loginByToken())
  }, [dispatch])

  if (loading) {
    return <Loader />
  }

  return (
    <Router history={history}>
      <RootRouter />
    </Router>
  )
}
