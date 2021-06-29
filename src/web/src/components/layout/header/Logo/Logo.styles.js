import styled from 'styled-components'

import { colors } from '@/utils/constants'

export const LogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
`

export const LogoText = styled.div`
  font-weight: 700;
  font-size: 1.35rem;
  line-height: 1;
  letter-spacing: 0.2em;
  color: ${colors.white(0.5)};
  text-shadow: 0.1rem 0.1rem 0.1rem ${colors.black(0.15)};
`
