import styled, { css } from 'styled-components'

import { Theme } from '@/theme/Theme'
import { colors } from '@/utils/constants'
import { Transition, TransitionAll } from '@/theme/CssHelpers'
import { Button } from '@/components/buttons/Button/Button.styles'

export const CardContainer = styled.div.attrs((props) => ({
  isDragging: props.isDragging || false,
}))`
  cursor: pointer;

  ${({ isDragging }) =>
    isDragging &&
    css`
      border-radius: ${Theme.radius};
      background-color: ${colors.black(0.2)};
      cursor: move;
    `}
`

export const CardName = styled.div`
  padding: 0.5rem;
  color: ${colors.black()};
  font-size: 0.875rem;
  line-height: 1rem;
  border-bottom-width: 1px;
  border-radius: ${Theme.radius};
  border-color: ${colors.gray.c400};
  background-color: ${colors.gray.c100};
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  ${Transition};

  &:hover {
    background-color: ${colors.gray.c50};
  }
`
