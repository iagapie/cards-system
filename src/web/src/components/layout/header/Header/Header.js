import { HomeIcon, PlusIcon } from '@heroicons/react/outline'
import { Link } from 'react-router-dom'
import { Menu } from '@headlessui/react'

import {
  HeaderContainer,
  HeaderGroup,
  GroupButton,
  GroupText,
  GroupMenuButton,
  GroupGravatar,
} from '@/components/layout/header/Header/Header.styles'
import { Logo } from '@/components/layout/header/Logo/Logo'
import { routes } from '@/utils/constants'
import { UserMenu } from '@/components/layout/header/UserMenu/UserMenu'
import { ModalCreateBoard } from '@/components/modals/ModalCreateBoard/ModalCreateBoard'

export const Header = () => {
  return (
    <HeaderContainer>
      <HeaderGroup>
        <li>
          <GroupButton as={Link} to={routes.board.list}>
            <HomeIcon />
            <GroupText weight="600" screen="md">
              Boards
            </GroupText>
          </GroupButton>
        </li>
      </HeaderGroup>
      <>
        <HeaderGroup>
          <li>
            <GroupButton>
              <PlusIcon />
            </GroupButton>
          </li>
          <Menu as="li">
            <GroupMenuButton>
              <GroupGravatar email="igoragapie@gmail.com" alt="iagapie" />
            </GroupMenuButton>
            <UserMenu />
          </Menu>
        </HeaderGroup>
        <ModalCreateBoard />
      </>
      <Logo />
    </HeaderContainer>
  )
}
