import styled from 'styled-components'
import { Menu } from '@headlessui/react'

import { colors, size } from '@/utils/constants'
import { Button } from '@/components/buttons/Button/Button.styles'
import { Gravatar } from '@/components/gravatar/Gravatar/Gravatar'

export const HeaderContainer = styled.header`
  position: relative;
  height: 2.594rem;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.black(0.2)};
`

export const HeaderGroup = styled.ul`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  gap: 0.25rem;
`

export const GroupButton = styled(Button).attrs((props) => ({
  screen: props.screen || 'xs',
  padding: props.padding || '0.375rem',
  gap: props.gap || '0.375rem',
}))`
  display: none;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: ${(props) => props.gap};
  align-items: center;
  padding: ${(props) => props.padding};
  color: ${colors.gray.c50};
  background-color: ${colors.white(0.3)};

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

export const GroupText = styled.span.attrs((props) => ({
  screen: props.screen || 'xs',
  weight: props.weight || '400',
  size: props.size || '1rem',
  line: props.line || '1',
}))`
  display: none;
  font-weight: ${(props) => props.weight};
  font-size: ${(props) => props.size};
  line-height: ${(props) => props.line};

  @media (min-width: ${(props) => size[props.screen]}) {
    display: block;
  }
`

export const GroupMenuButton = styled(Button).attrs((props) => ({
  as: props.as || Menu.Button,
}))`
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

export const GroupGravatar = styled.div.attrs((props) => ({
  as: props.as || Gravatar,
}))`
  border-radius: 9999px;
`
