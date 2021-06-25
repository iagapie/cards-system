import { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { HomeIcon, PlusIcon } from '@heroicons/react/outline'
import { Menu, Transition } from '@headlessui/react'

import { getAuth, getBoards } from '../../redux/selectors'
import { logout } from '../../redux/slices/auth'
import { HeaderLink } from './HeaderLink'
import { HeaderButton } from './HeaderButton'
import { ROUTES } from '../../constants/routes'
import { APP } from '../../constants/app'
import { CreateBoardDialog } from '../BoardList/CreateBoardDialog'
import { setIsOpen } from '../../redux/slices/createBoard'
import { Gravatar } from '../Gravatar'

export const Header = ({ className }) => {
  const { isAuthenticated, currentUser } = useSelector(getAuth)
  const { boards } = useSelector(getBoards)
  const dispatch = useDispatch()

  const canCreateBoard = useMemo(() => boards.length < 100, [boards])

  const openCreateBoard = () => {
    dispatch(setIsOpen(true))
  }

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
        <>
          <ul className="ml-auto flex items-center space-x-1">
            {canCreateBoard && (
              <li onClick={openCreateBoard}>
                <HeaderButton icon={<PlusIcon />} />
              </li>
            )}
            <li>
              <Menu>
                <Menu.Button className="block ring-2 ring-transparent rounded-full hover:ring-gray-100 focus:outline-none">
                  <Gravatar
                    email={currentUser.email}
                    alt={currentUser.name}
                    className="row-span-2 h-7 w-7 rounded-full"
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="grid grid-flow-row absolute right-1 w-80 mt-2 py-1 origin-top-right bg-white rounded shadow ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="flex items-center justify-center text-base text-blue-gray-500 mx-3 py-2 border-b border-gray-200">
                      Account
                    </div>
                    <div className="grid grid-rows-2 grid-flow-col auto-cols-max gap-x-2 mx-3 py-3 border-b border-gray-200">
                      <Gravatar
                        email={currentUser.email}
                        alt={currentUser.name}
                        className="row-span-2 h-10 w-10 rounded-full"
                      />
                      <div className="text-sm text-blue-gray-800">{currentUser.name}</div>
                      <div className="text-sm text-gray-400">{currentUser.email}</div>
                    </div>
                    <Menu.Item
                      as="button"
                      onClick={signOut}
                      className="px-3 py-1 my-2 text-left text-blue-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </li>
          </ul>
          {canCreateBoard && <CreateBoardDialog />}
        </>
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
