import styled from 'styled-components'

import { colors, size } from '@/utils/constants'
import { Button } from '@/components/buttons/Button/Button.styles'
import { Gravatar } from '@/components/gravatar/Gravatar/Gravatar'

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HeaderGroup = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: 0.5rem;
`

export const HeaderButton = styled(Button).attrs((props) => ({
  screen: props.screen || 'xs',
}))`
  display: none;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: 0.375rem;
  align-items: center;
  padding: 0.375rem;
  color: ${colors.gray.c50};
  background-color: ${colors.white(0.3)};
  height: 100%;

  @media (min-width: ${(props) => size[props.screen]}) {
    display: grid;
  }

  &:hover {
    background-color: ${colors.white(0.2)};
  }

  & > svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

export const HeaderText = styled.span.attrs((props) => ({
  screen: props.screen || 'xs',
}))`
  display: none;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1;

  @media (min-width: ${(props) => size[props.screen]}) {
    display: block;
  }
`

export const BoardName = styled(HeaderButton).attrs((props) => ({
  as: props.as || 'div',
}))`
  overflow: hidden;

  & > button {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    line-height: 1;
  }
`

export const HeaderDivide = styled.div`
  display: none;
  width: 1px;
  height: 60%;
  background-color: ${colors.white(0.2)};

  @media (min-width: ${size.md}) {
    display: block;
  }
`

export const HeaderUserGroup = styled.div`
  display: none;

  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: -0.5rem;
  }

  @media (min-width: ${size.md}) {
    display: flex;
  }
`

export const HeaderUserButton = styled(Button)`
  display: block;
  border-radius: 9999px;
  height: 2rem;
  width: 2rem;
  color: ${colors.white()};

  &:hover {
    padding: 0.05rem;
    box-shadow: 0 0 0 0.05rem ${colors.white(0.3)}, 0 0 #0000;
  }
`

export const HeaderGravatar = styled.div.attrs((props) => ({
  as: props.as || Gravatar,
}))`
  border-radius: 9999px;
`
