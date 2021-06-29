import styled from 'styled-components'

import { colors, size } from '@/utils/constants'
import { GridCenter } from '@/theme/CssHelpers'

export const Main = styled.main`
  width: 100%;
  height: 100%;
  background-color: ${colors.gray.c100};
`

export const Wrapper = styled.div`
  padding: 5rem 1.5rem;
  margin: 0 auto;
  text-align: center;

  @media (min-width: ${size.md}) {
    max-width: ${size.sm};
  }
`

export const Title = styled.h1`
  margin-bottom: 1.25rem;
  font-weight: 700;
  font-size: 1.875rem;
  line-height: 2.25rem;
  color: ${colors.blueGray.c500};
`

export const Text = styled.p`
  font-size: 1.125rem;
  line-height: 1.75rem;
  color: ${colors.blueGray.c500};
  text-align: center;
`

export const Toolbar = styled.div`
  ${GridCenter};
  gap: 0.375rem;
  margin-top: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: ${colors.blueGray.c800};
`

export const User = styled.strong`
  font-weight: 600;
`

export const Link = styled.button`
  text-decoration: underline;
  color: ${colors.blueGray.c800};

  &:focus {
    outline: none;
  }

  &:hover {
    text-decoration: none;
  }
`
