import styled from 'styled-components'

import { colors } from '@/utils/constants'
import { Loading } from '@/components/loading/Loading/Loading'

const Main = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray.c100};
`

export const Loader = () => (
  <Main>
    <Loading />
  </Main>
)
