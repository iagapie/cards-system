import styled, { keyframes } from 'styled-components'

import { Theme } from '@/theme/Theme'
import { EaseIn, GridCenter, Transition } from '@/theme/CssHelpers'
import { colors } from '@/utils/constants'

export const Button = styled.button`
  cursor: pointer;
  border-radius: ${Theme.radius};
  ${GridCenter};
  ${Transition};
  ${EaseIn};

  &:focus {
    outline: none;
  }

  &:disabled {
    cursor: default;
  }
`

const rotate = keyframes`
  0% {
    transform: rotate(0 deg);
  }

  50% {
    transform: rotate(180 deg);
    opacity: .35;
  }

  100% {
    transform: rotate(360deg);
  }
`

export const Load = styled.span.attrs((props) => ({
  size: props.size || '1rem',
  color: props.color || colors.gray.c500,
}))`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-color: ${(props) => props.color};
  border-top-color: transparent;
  border-width: 0.125rem;
  border-radius: 100%;
  animation: ${rotate} infinite linear 1s;
`
