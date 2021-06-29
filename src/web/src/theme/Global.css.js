import { createGlobalStyle } from 'styled-components'

import NormalizeCss from '@/theme/Normalize.css'

const GlobalCss = createGlobalStyle`
  ${NormalizeCss}

  #root {
    height: 100vh;
  }

  .opacity-0 {
    opacity: 0;
  }

  .opacity-100 {
    opacity: 1;
  }

  .ease-in {
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  .ease-out {
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }

  .duration-75 {
    transition-duration: 75ms;
  }

  .duration-100 {
    transition-duration: 100ms;
  }

  .duration-200 {
    transition-duration: 200ms;
  }

  .duration-300 {
    transition-duration: 300ms;
  }

  .transition {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter,
      -webkit-backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter,
      backdrop-filter;
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter,
      backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }

  .transform-95 {
    transform: translateX(0) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(0.95) scaleY(0.95);
  }

  .transform-100 {
    transform: translateX(0) translateY(0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1);
  }
`

export default GlobalCss
