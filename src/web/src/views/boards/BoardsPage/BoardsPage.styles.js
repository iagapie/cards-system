import styled from 'styled-components'

import { colors, size } from '@/utils/constants'
import { Container, GridCenter } from '@/theme/CssHelpers'
import { Button } from '@/components/buttons/Button/Button.styles'

export const Main = styled.main`
  height: 100%;
  z-index: 0;
  overflow-y: auto;
  background-color: ${colors.gray.c100};
`

export const Wrapper = styled.div`
  ${Container};
  display: flex;
  flex-direction: column;
  justify-content: left;
  gap: 1rem;
  padding: 1rem;
  margin: 0 auto;

  @media (min-width: ${size.lg}) {
    padding: 3.5rem;
  }
`

export const Title = styled.h3`
  ${GridCenter};
  justify-content: left;
  gap: 0.875rem;
`

export const Icon = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  color: ${colors.blueGray.c600};
`

export const Text = styled.span`
  color: ${colors.blueGray.c700};
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.75rem;
`

export const List = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (min-width: ${size.md}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: ${size.lg}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (min-width: ${size.xl}) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (min-width: ${size.xxl}) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
`

export const NewItem = styled(Button)`
  height: 7rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5rem;
  color: ${colors.blueGray.c800};
  background-color: ${colors.gray.c200};

  &:hover {
    background-color: ${colors.gray.c300};
    opacity: 0.9;
  }
`
