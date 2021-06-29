import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { colors, size } from '@/utils/constants'
import { Theme } from '@/theme/Theme'
import { Button } from '@/components/buttons/Button/Button.styles'
import { FlexCenter } from '@/theme/CssHelpers'

export const Wrapper = styled.div`
  background-color: ${colors.white()};
  width: 100%;
  height: 100%;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;

  @media (min-width: ${size.sm}) {
    max-width: 26rem;
    height: auto;
    padding-left: 2rem;
    padding-right: 2rem;
    border-radius: ${Theme.radius};
    box-shadow: 0 0 transparent, 0 0 transparent, 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }

  @media (min-width: ${size.lg}) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`

export const Error = styled.div`
  color: ${colors.red.c500};
  text-align: center;
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.75rem;
  text-align: center;
`

export const Form = styled.form`
  margin-top: 1.5rem;
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${colors.gray.c700};
  border-radius: ${Theme.radius};
  border-width: 2px;
  border-color: ${colors.gray.c300};

  &::placeholder {
    color: ${colors.gray.c400};
  }

  &:focus {
    outline: none;
    border-color: ${colors.sky.c400};
  }
`

export const InputError = styled.strong`
  display: block;
  color: ${colors.red.c500};
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 0.25rem;
`

export const Btn = styled(Button)`
  color: ${colors.white()};
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5rem;
  background-color: ${colors.sky.c600};
  padding: 0.5rem;
  gap: 0.5rem;

  &:hover {
    background-color: ${colors.sky.c700};
  }

  &:disabled {
    background-color: ${colors.gray.c300};
    color: ${colors.gray.c500};
  }
`

export const Toolbar = styled.div`
  ${FlexCenter};
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top-width: 1px;
  border-color: ${colors.gray.c300};
`

export const RouterLink = styled(Link)`
  font-size: 0.875rem;
  color: ${colors.sky.c600};

  &:hover {
    text-decoration: underline;
  }
`

export const DivideDot = styled.span`
  display: block;

  &::after {
    content: '\\2022';
    color: ${colors.gray.c700};
    font-weight: 700;
    padding: 0 0.5rem;
  }
`
