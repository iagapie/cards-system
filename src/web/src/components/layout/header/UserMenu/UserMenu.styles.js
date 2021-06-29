import styled, { css } from 'styled-components'
import { Menu } from '@headlessui/react'

import { colors } from '@/utils/constants'
import { Theme } from '@/theme/Theme'
import { GroupGravatar } from '@/components/layout/header/Header/Header.styles'
import { Button } from '@/components/buttons/Button/Button.styles'

export const UserMenuItems = styled.div.attrs((props) => ({
  as: props.as || Menu.Items,
}))`
  position: absolute;
  z-index: 10;
  transform-origin: top right;
  right: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.25rem 0;
  width: 19rem;
  display: grid;
  grid-auto-flow: row;
  background-color: ${colors.white()};
  border-radius: ${Theme.radius};
  box-shadow: 0 0 transparent, 0 0 transparent, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`

const style = css`
  margin: 0 0.75rem;
  padding: 0.75rem 0;
  border-bottom-width: 1px;
  border-color: ${colors.gray.c200};
`

export const UserMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.blueGray.c500};
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1;
  ${style};
`

export const UserMenuInfo = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  column-gap: 0.5rem;
  align-items: center;
  ${style};
`

export const UserAvatar = styled(GroupGravatar)`
  height: 2.5rem;
  width: 2.5rem;
  grid-row: span 2 / span 2;
`

export const UserName = styled.div`
  font-family: sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  color: ${colors.blueGray.c600};
`

export const UserEmail = styled(UserName)`
  font-size: 0.75rem;
  color: ${colors.gray.c400};
`

export const UserMenuBody = styled.div`
  padding: 0.5rem 0;
  display: grid;
  grid-auto-flow: row;
  border-bottom-width: 1px;
  border-color: ${colors.gray.c200};

  &:last-child {
    border-width: 0;
    padding-bottom: 0.3rem;
  }
`

export const UserMenuItem = styled(Button)`
  padding: 0.3rem 0.75rem;
  justify-content: left;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0;
  color: ${colors.blueGray.c600};

  &:hover {
    background-color: ${colors.gray.c100};
  }
`
