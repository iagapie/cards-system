import { Link } from 'react-router-dom'

import { routes } from '@/utils/constants'

const HomePage = () => (
  <>
    <h1>Hello World</h1>
    <div>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus amet commodi consectetur cum delectus dolor
      eveniet magni non numquam odit possimus recusandae reiciendis repellendus tenetur totam ullam, vero voluptatibus.
      Ipsam?
    </div>
    <Link to={routes.board.list}>Boards</Link>
  </>
)

export default HomePage
