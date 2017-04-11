import Cookies from 'js-cookie'

export function authJson (res) {
  if (res.status === 401) throw new Error('401')
  return res.json()
}

export function tokenHeader () {
  let token = Cookies.get('jungletoken')

  if (!token) return {}

  return { 'Authorization': `Bearer ${token}` }
}
