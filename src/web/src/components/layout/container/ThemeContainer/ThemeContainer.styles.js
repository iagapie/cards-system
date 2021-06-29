import styled from 'styled-components'

import { colors } from '@/utils/constants'

export const ThemeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: ${(props) => props.theme.background};
`

ThemeContainer.defaultProps = {
  theme: {
    background: colors.white(),
  },
}
