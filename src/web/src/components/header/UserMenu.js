import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Transition, Menu } from '@headlessui/react'

import { Gravatar } from '@/components/gravatar/Gravatar'

export const UserMenu = () => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-75"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <Menu.Items className="user-menu">
      <div className="user-menu__header">Account</div>
      <div className="user-menu__info">
        <Gravatar className="user-menu__avatar" email="igoragapie@gmail.com" alt="iagapie" />
        <div className="user-menu__name">Igor Agapie</div>
        <div className="user-menu__email">igoragapie@gmail.com</div>
      </div>
      <div className="user-menu__group">
        <Link to="/profile" className="user-menu__item" role="button">
          Profile
        </Link>
        <Link to="/profile" className="user-menu__item" role="button">
          Settings
        </Link>
      </div>
      <div className="user-menu__group">
        <button className="user-menu__item">Log out</button>
      </div>
    </Menu.Items>
  </Transition>
)
