import Cookies from 'js-cookie'

const TokenKey = 'fs-Token'
const OnceToken = 'fs-OnceToken'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function getOnceToken() {
  return Cookies.get(OnceToken)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setOnceToken(onceToken) {
  return Cookies.set(OnceToken, onceToken)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeOnceToken() {
  return Cookies.remove(OnceToken)
}