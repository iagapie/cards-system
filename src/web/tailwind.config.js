const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ['./src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        'blue-gray': colors.blueGray,
        orange: colors.orange,
        lime: colors.lime,
      },
      maxWidth: {
        'max-w-8': '2rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      const components = {}

      const styles = {
        bg: 'backgroundColor',
        text: 'color',
      }

      const colors = {
        white: '255',
        black: '34',
      }

      for (let i = 0; i <= 10; i++) {
        const a = 10 === i ? '1' : `0.${i}`
        for (const [sk, sv] of Object.entries(styles)) {
          for (const [ck, cv] of Object.entries(colors)) {
            components[`.${sk}-${ck}-${i}0`] = {
              [sv]: `rgba(${cv}, ${cv}, ${cv}, ${a})`,
            }
          }
        }
      }

      addComponents(components, ['responsive', 'hover', 'group-hover', 'active', 'disabled', 'visited', 'checked'])
    }),
  ],
}
