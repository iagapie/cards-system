import { useDispatch, useSelector } from 'react-redux'

import { DocumentTitle } from '../components/DocumentTitle'
import { getAuth } from '../redux/selectors'
import { logout } from '../redux/slices/auth'

export const NotFound = () => {
  const { isAuthenticated, currentUser } = useSelector(getAuth)
  const dispatch = useDispatch()

  const signOut = () => {
    dispatch(logout())
  }

  return (
    <main className="h-full bg-gray-100">
      <DocumentTitle title="Not Found" />
      <div className="flex flex-col items-center md:w-3/4 lg:w-2/3 xl:w-2/5 2xl:w-3/12 mx-auto px-4 py-20">
        <h1 className="pb-5 text-blue-gray-500 text-3xl font-bold">Board not found.</h1>
        <p className="text-blue-gray-500 text-lg text-center">
          This board may be private. If someone gave you this link, they may need to invite you to one of their boards.
        </p>
        {isAuthenticated && (
          <div className="mt-4 grid grid-flow-col gap-1.5 text-blue-gray-800 text-base">
            <span>
              Not <strong>{currentUser.name}</strong>?
            </span>
            <button className="underline" onClick={signOut}>
              Switch accounts
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
