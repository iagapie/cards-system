import Cookies from '@/services/Cookies/Cookies.service'

const key = 'tokens'

export const getTokens = () => Cookies.getItem(key)

export const setTokens = ({ accessToken, refreshToken }) => Cookies.set(key, { accessToken, refreshToken })

export const removeTokens = () => Cookies.remove(key)

export const rewriteTokens = ({ accessToken, refreshToken }) => {
  removeTokens()
  setTokens({ accessToken, refreshToken })
}
