import styled, { css } from 'styled-components'

import { Button } from '@/components/buttons/Button/Button.styles'
import { colors } from '@/utils/constants'
import { Theme } from '@/theme/Theme'
import { TransitionAll } from '@/theme/CssHelpers'

export const CategoryContainer = styled.div.attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  width: 16rem;

  & form {
    width: 100%;
    overflow: hidden;

    ${({ isOpen }) =>
      isOpen &&
      css`
        padding: 0.25rem;
        border-radius: ${Theme.radius};
        background-color: ${colors.gray.c200};
        box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      `}
  }
`

export const CategoryOpenButton = styled(Button).attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  width: 100%;
  justify-content: start;
  gap: 0.25rem;
  padding: 0.65rem;
  font-size: 0.875rem;
  line-height: 1rem;
  color: ${colors.gray.c50};
  background-color: ${colors.white(0.3)};
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: none;
    `}

  &:hover {
    background-color: ${colors.white(0.2)};
  }

  & > svg {
    width: 1rem;
    height: 1rem;
  }
`

export const CategoryInput = styled.input.attrs((props) => ({
  color: props.color || 'sky',
  isOpen: props.isOpen || false,
}))`
  display: none;
  width: 100%;
  padding: 0.375rem 0.5rem;
  border-radius: ${Theme.radius};
  border-width: 2px;
  border-color: ${colors.gray.c400};
  color: ${colors.gray.c400};
  font-size: 0.875rem;

  ${({ isOpen }) =>
    isOpen &&
    TransitionAll &&
    css`
      display: block;
      transition-duration: 100ms;
    `}

  &:focus {
    outline: none;
    border-color: ${({ color }) => Theme.focus[color]};
  }

  &::placeholder {
    color: ${colors.gray.c400};
  }
`

export const CategoryToolbar = styled.div.attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  width: 100%;
  height: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  justify-content: start;
  gap: 0.5rem;

  ${({ isOpen }) =>
    isOpen &&
    TransitionAll &&
    css`
      height: auto;
      padding-top: 0.25rem;
      transition-duration: 100ms;
    `}
`

export const CategoryAddBtn = styled(Button).attrs((props) => ({
  color: props.color || 'sky',
}))`
  gap: 0.75rem;
  padding: 0.375rem 0.75rem;
  color: ${colors.white()};
  font-size: 0.875rem;
  line-height: 1.25rem;
  background-color: ${({ color }) => Theme.btn[color]};

  &:hover {
    background-color: ${({ color }) => Theme.hover[color]};
  }

  &:disabled {
    background-color: ${colors.gray.c400};
  }
`

export const CategoryCloseBtn = styled(Button)`
  color: ${colors.gray.c500};

  &:hover {
    color: ${colors.black()};
  }

  & > svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`
