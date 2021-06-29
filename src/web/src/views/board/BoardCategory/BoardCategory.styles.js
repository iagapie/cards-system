import styled, { css } from 'styled-components'

import { Theme } from '@/theme/Theme'
import { colors } from '@/utils/constants'
import { Button } from '@/components/buttons/Button/Button.styles'

export const CategoryContainer = styled.div.attrs((props) => ({
  isDragging: props.isDragging || false,
}))`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-radius: ${Theme.radius};
  background-color: ${colors.black(0.2)};

  ${({ isDragging }) =>
    isDragging &&
    css`
      border-radius: ${Theme.radius};
      background-color: ${colors.black(0.2)};
    `}
`

export const CategoryWrapper = styled.div`
  cursor: move;
  width: 16rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  border-radius: ${Theme.radius};
  background-color: ${colors.gray.c200};
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  & > :not([hidden]) ~ :not([hidden]) {
    margin-top: 0.5rem;
  }
`

export const CategoryHeader = styled.div`
  padding-left: 0.5rem;
  display: flex;
  align-items: center;
`

export const CategoryHeaderTitle = styled.h2`
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${colors.black()};
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1rem;
  cursor: pointer;
`

export const CategoryHeaderButton = styled(Button)`
  padding: 0.5rem;
  line-height: 1rem;
  color: ${colors.blueGray.c500};

  &:hover {
    color: ${colors.black()};
    background-color: ${colors.gray.c300};
  }
`

export const CategoryHeaderIcon = styled.div`
  width: 1rem;
  height: 1rem;
`

export const CategoryCardList = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 0.5rem;
  overflow-y: auto;
  z-index: 0;
`
