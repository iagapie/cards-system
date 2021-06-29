import { css } from 'styled-components'

import { size } from '@/utils/constants'

export const FlexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const GridCenter = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: center;
  justify-content: center;
`

export const Container = css`
  width: 100%;

  @media (min-width: ${size.sm}) {
    max-width: ${size.sm};
  }

  @media (min-width: ${size.md}) {
    max-width: ${size.md};
  }

  @media (min-width: ${size.lg}) {
    max-width: ${size.lg};
  }

  @media (min-width: ${size.xl}) {
    max-width: ${size.xl};
  }

  @media (min-width: ${size.xxl}) {
    max-width: ${size.xxl};
  }
`

export const TransitionAll = css`
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

export const Transition = css`
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter,
    -webkit-backdrop-filter;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

export const TransitionColors = css`
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

export const TransitionOpacity = css`
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

export const TransitionShadow = css`
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

export const TransitionTransform = css`
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

export const EaseLinear = css`
  transition-timing-function: linear;
`

export const EaseIn = css`
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
`

export const EaseOut = css`
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
`

export const EaseInOut = css`
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
`
