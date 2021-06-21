import { Link } from 'react-router-dom'

import { ROUTES } from '../constants/routes'

const Home = () => (
  <div className="flex flex-col items-center justify-center text-gray-50 p-20">
    <h1 className="text-2xl pb-8">Home Page</h1>
    <div>
      <Link to={ROUTES.BOARD.LIST} className="text-lg underline hover:no-underline">
        Boards
      </Link>
    </div>
  </div>
)

export default Home
