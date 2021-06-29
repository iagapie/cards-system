import { DotsHorizontalIcon, LockClosedIcon } from '@heroicons/react/outline'

import {
  HeaderContainer,
  HeaderGroup,
  BoardName,
  HeaderDivide,
  HeaderButton,
  HeaderText,
  HeaderUserGroup,
  HeaderUserButton,
  HeaderGravatar,
} from '@/views/board/BoardHeader/BoardHeader.styles'
import { Button } from '@/components/buttons/Button/Button.styles'
import { useBoardState } from '@/contexts/BoardStateContext'

export const BoardHeader = () => {
  const { isOpen, setIsOpen } = useBoardState()

  const onOpen = () => setIsOpen(true)

  return (
    <HeaderContainer>
      <HeaderGroup>
        <BoardName>
          <Button>Board Name</Button>
        </BoardName>
        <HeaderDivide />
        <HeaderButton>
          <LockClosedIcon />
          <HeaderText screen="md">Private</HeaderText>
        </HeaderButton>
        <HeaderDivide />
        <HeaderUserGroup>
          <HeaderUserButton>
            <HeaderGravatar email="igoragapie@gmail.com" alt="iagapie" />
          </HeaderUserButton>
          <HeaderUserButton>
            <HeaderGravatar email="iagapie@gmail.com" alt="iagapie" />
          </HeaderUserButton>
        </HeaderUserGroup>
        <HeaderButton screen="md">
          <HeaderText>Invite</HeaderText>
        </HeaderButton>
      </HeaderGroup>
      <HeaderGroup>
        {!isOpen && (
          <HeaderButton onClick={onOpen}>
            <DotsHorizontalIcon />
            <HeaderText screen="md">Show menu</HeaderText>
          </HeaderButton>
        )}
      </HeaderGroup>
    </HeaderContainer>
  )
}
