import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { HomeIcon, PlusIcon } from '@heroicons/react/outline'
import { Menu } from '@headlessui/react'

import { appName, routes } from '@/utils/constants'
import { Gravatar } from '@/components/gravatar/Gravatar'
import { AddBoardModal } from '@/components/modals/AddBoard/AddBoardModal'
import { canAddBoard, getAuth } from '@/store/selectors'
import { setModalIsOpen } from '@/store/boards/boards.slice'

import { UserMenu } from './UserMenu'

export const Header = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector(getAuth)
  const canCreateBoard = useSelector(canAddBoard)

  const onOpen = () => {
    dispatch(setModalIsOpen(true))
  }

  return (
    <>
      <AddBoardModal />
      <header className="header">
        <Link to={routes.root} className="header__logo">
          {appName.short}
        </Link>
        <ul className="header__group">
          <li>
            <Link to={routes.board.list} className="header-btn" role="button">
              <HomeIcon className="header-btn__icon" />
              <span className="header-btn__text header-btn__text_bold header-btn__text_md">Boards</span>
            </Link>
          </li>
        </ul>
        <ul className="header__group">
          {canCreateBoard && (
            <li>
              <button className="header-btn" onClick={onOpen}>
                <PlusIcon className="header-btn__icon" />
              </button>
            </li>
          )}
          <Menu as="li">
            <Menu.Button className="header-btn header-btn_circle">
              <Gravatar className="header-btn__avatar" email={currentUser.email} alt={currentUser.name} />
            </Menu.Button>
            <UserMenu />
          </Menu>
        </ul>
      </header>
    </>
  )
}
