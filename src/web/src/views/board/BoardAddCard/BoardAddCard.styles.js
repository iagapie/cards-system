import styled, { css } from 'styled-components'

import { Button } from '@/components/buttons/Button/Button.styles'
import { colors } from '@/utils/constants'
import { Theme } from '@/theme/Theme'
import { TransitionAll } from '@/theme/CssHelpers'

export const CardContainer = styled.form.attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  display: grid;
  grid-auto-flow: row;
  overflow: hidden;

  ${({ isOpen }) =>
    isOpen &&
    css`
      gap: 0.5rem;
    `}
`

export const CardOpenBtn = styled(Button).attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  width: 100%;
  gap: 0.25rem;
  justify-content: left;
  padding: 0.5rem 0.75rem;
  color: ${colors.blueGray.c500};
  line-height: 1rem;
  font-size: 0.875rem;
  font-weight: 500;

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: none;
    `}

  &:hover {
    color: ${colors.blueGray.c700};
    background-color: ${colors.gray.c300};
  }

  & > svg {
    width: 1rem;
    height: 1rem;
  }
`

export const CardTextarea = styled.textarea.attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  display: none;
  width: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.875rem;
  color: ${colors.black()};
  border-bottom-width: 1px;
  border-radius: ${Theme.radius};
  border-color: ${colors.gray.c400};
  background-color: ${colors.gray.c100};
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  resize: none;

  ${({ isOpen }) =>
    isOpen &&
    TransitionAll &&
    css`
      display: block;
      transition-duration: 100ms;
    `}

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-size: 0.875rem;
    color: ${colors.gray.c400};
  }
`

export const CardToolbar = styled.div.attrs((props) => ({
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
      transition-duration: 100ms;
    `}
`

export const CardAddBtn = styled(Button).attrs((props) => ({
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

export const CardCloseBtn = styled(Button)`
  color: ${colors.gray.c500};

  &:hover {
    color: ${colors.black()};
  }

  & > svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`
