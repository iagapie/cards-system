import styled, { css, keyframes } from 'styled-components'

import { Theme } from '@/theme/Theme'
import { colors } from '@/utils/constants'

const pulse = keyframes`
  50% {
    opacity: 0.5;
  }
`

const jumping = keyframes`
  50% {
    transform: scaleY(0.85);
  }
  100% {
    transform: scaleY(1);
  }
`

const style = css`
  border-radius: 0.125rem;
  box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`

export const Container = styled.div.attrs((props) => ({
  color: props.color || 'sky',
}))`
  position: relative;
  display: flex;
  padding: 0.25rem;
  -webkit-user-select: none;
  user-select: none;
  background-color: ${({ color }) => Theme.bg[color]};
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  ${style};

  & > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.25rem;
  }
`

export const ItemXxl = styled.div`
  width: 1.9rem;
  height: 3.75rem;
  background-color: ${colors.gray.c200};
  transform-origin: 100% 0;
  animation: ${jumping} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  ${style};
`

export const ItemXl = styled(ItemXxl)`
  height: 2.5rem;
`

export const ItemLg = styled(ItemXxl)`
  height: 1.5rem;
`

export const ItemNew = styled.div`
  width: 1.9rem;
  height: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.16rem;
  line-height: 0.16rem;
  color: ${colors.gray.c50};
  background-color: ${colors.white(0.3)};
  ${style};

  & svg {
    width: 0.15rem;
    height: 0.15rem;
  }
`

export const Text = styled.span`
  position: absolute;
  right: 0.125rem;
  bottom: 0.125rem;
  color: ${colors.gray.c50};
  font-size: 0.5rem;
  line-height: 0.75rem;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`
