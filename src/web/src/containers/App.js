import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getAuth } from '../selectors'
import { login } from '../slices/auth'

const App = () => {
  const { loading } = useSelector(getAuth)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(login())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  return <h1>Hello World</h1>
}

export default App
