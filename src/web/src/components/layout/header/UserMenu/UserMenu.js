import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

import {
  UserMenuItems,
  UserMenuBody,
  UserMenuItem,
  UserAvatar,
  UserMenuHeader,
  UserMenuInfo,
  UserName,
  UserEmail,
} from '@/components/layout/header/UserMenu/UserMenu.styles'

export const UserMenu = () => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform-95 opacity-0"
    enterTo="transform-100 opacity-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform-100 opacity-100"
    leaveTo="transform-95 opacity-0"
  >
    <UserMenuItems>
      <UserMenuHeader>Account</UserMenuHeader>
      <UserMenuInfo>
        <UserAvatar email="igoragapie@gmail.com" alt="iagapie" />
        <UserName>Igor Agapie</UserName>
        <UserEmail>igoragapie@gmail.com</UserEmail>
      </UserMenuInfo>
      <UserMenuBody>
        <UserMenuItem>Profile</UserMenuItem>
        <UserMenuItem>Settings</UserMenuItem>
      </UserMenuBody>
      <UserMenuBody>
        <UserMenuItem>Log out</UserMenuItem>
      </UserMenuBody>
    </UserMenuItems>
  </Transition>
)
