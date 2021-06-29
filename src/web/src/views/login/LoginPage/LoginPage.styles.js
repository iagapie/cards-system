import styled from 'styled-components'

import { FlexCenter } from '@/theme/CssHelpers'
import { colors } from '@/utils/constants'

export const Main = styled.main`
  width: 100%;
  height: 100%;
  background-color: ${colors.gray.c100};
  ${FlexCenter};
`
