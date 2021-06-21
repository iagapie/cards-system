import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { HomeIcon, PlusIcon } from '@heroicons/react/outline'

import { getAuth } from '../../selectors'
import { logout } from '../../slices/auth'
import { HeaderLink } from './HeaderLink'
import { HeaderButton } from './HeaderButton'
import { ROUTES } from '../../constants/routes'
import { APP } from '../../constants/app'

export const Header = ({ className }) => {
  const { isAuthenticated } = useSelector(getAuth)
  const dispatch = useDispatch()

  const signOut = () => {
    dispatch(logout())
  }

  return (
    <header className={`flex items-center relative p-1 ${className}`}>
      <ul className="mr-auto flex items-center space-x-1">
        <li>
          <HeaderLink to={ROUTES.BOARD.LIST} text="Boards" icon={<HomeIcon />} />
        </li>
      </ul>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-xl text-white-50 leading-3 font-bold tracking-widest">
          <Link to={ROUTES.ROOT}>{APP.NAME.SHORT}</Link>
        </h1>
      </div>
      {isAuthenticated && (
        <ul className="ml-auto flex items-center space-x-1">
          <li>
            <HeaderButton icon={<PlusIcon />} />
          </li>
          <li>
            <button className="block" onClick={signOut}>
              <img
                className="h-8 w-8 rounded-full"
                src="https://trello-members.s3.amazonaws.com/57865bc0db707d97e6cdb6ad/98325c199f92181706beffbfc15e3a9d/170.png"
                alt="Igor Agapie (iagapie)"
              />
            </button>
          </li>
        </ul>
      )}
    </header>
  )
}

Header.propTypes = {
  className: PropTypes.string,
}

Header.defaultProps = {
  className: 'bg-black-20',
}
