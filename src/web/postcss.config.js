const flexboxFixes = require('postcss-flexbugs-fixes')
const presetEnv = require('postcss-preset-env')
const normalize = require('postcss-normalize')

module.exports = {
  plugins: [
    flexboxFixes,
    presetEnv({
      browsers: 'last 2 versions',
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    normalize(),
  ],
}
