import Cookie from 'js-cookie'

Cookie.defaults = {
  sameSite: 'Lax',
}

export const getToken = () => Cookie.get('token')
export const getRefreshToken = () => Cookie.get('refresh')

export const setTokens = ({ accessToken, refreshToken }) => {
  Cookie.set('token', accessToken)
  Cookie.set('refresh', refreshToken)
}

export const removeTokens = () => {
  Cookie.remove('token')
  Cookie.remove('refresh')
}

export const rewriteTokens = ({ accessToken, refreshToken }) => {
  removeTokens()
  setTokens({ accessToken, refreshToken })
}
