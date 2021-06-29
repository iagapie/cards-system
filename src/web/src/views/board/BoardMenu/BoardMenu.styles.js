import styled, { css } from 'styled-components'

import { colors } from '@/utils/constants'
import { TransitionAll } from '@/theme/CssHelpers'
import { Button } from '@/components/buttons/Button/Button.styles'
import { Theme } from '@/theme/Theme'

const divide = css`
  & > :not([hidden]) ~ :not([hidden]) {
    border-top-width: 1px;
    border-color: ${colors.gray.c300};
  }
`

export const BoardMenuContainer = styled.div.attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  position: absolute;
  z-index: 40;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${colors.gray.c200};
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  ${TransitionAll};
  transition-duration: 400ms;
  ${divide};
  width: 0;

  ${({ isOpen }) =>
    isOpen &&
    css`
      width: 20rem;
      padding: 0.625rem;
    `}

  & svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

export const BoardMenuHeader = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0.625rem;
  font-weight: 700;
  font-size: 1rem;
  color: ${colors.black()};
`

export const BoardMenuHeaderBtn = styled(Button).attrs((props) => ({
  isOpen: props.isOpen || false,
}))`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  padding-bottom: 0.625rem;
  display: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      display: grid;
    `}

  &:hover {
    color: ${colors.gray.c800};
  }
`

export const BoardMenuBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${divide};
`

export const BoardMenuItems = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;

  & > :not([hidden]) ~ :not([hidden]) {
    margin-top: 0.25rem;
  }
`

export const BoardMenuItem = styled(Button)`
  padding: 0.25rem 0.75rem;
  gap: 0.5rem;
  justify-content: left;
  color: ${colors.black()};
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5rem;

  &:hover {
    background-color: ${colors.gray.c300};
  }
`

export const BoardMenuItemBg = styled.span.attrs((props) => ({
  color: props.color || 'sky',
}))`
  display: block;
  border-radius: ${Theme.radius};
  width: 1.25rem;
  height: 1.25rem;
  background-color: ${({ color }) => Theme.bg[color]};
`

export const BoardMenuActivityHeader = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  color: ${colors.black()};
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1rem;

  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.5rem;
  }
`
