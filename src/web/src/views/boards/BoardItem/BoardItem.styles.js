import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Theme } from '@/theme/Theme'
import { colors } from '@/utils/constants'
import { EaseIn, Transition } from '@/theme/CssHelpers'

export const BoardLink = styled.a.attrs((props) => ({
  as: props.as || Link,
  bg: props.bg || Theme.bg.sky,
}))`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 7rem;
  padding: 0.375rem 0.5rem;
  border-radius: ${Theme.radius};
  background-color: ${({ bg }) => bg};

  &::before {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: ${Theme.radius};
    background-color: ${colors.black(0.1)};
    ${Transition};
    ${EaseIn};
  }

  &:hover::before {
    background-color: ${colors.black(0.2)};
  }
`

export const BoardName = styled.div`
  z-index: 1;
  max-height: 3rem;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  color: ${colors.gray.c50};
  overflow: hidden;
  text-overflow: ellipsis;
`
