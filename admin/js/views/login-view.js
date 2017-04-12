import { connect } from 'preact-redux'
import ActionButton from '../components/action-button'
import TextInput from '../components/text-input'
import { fetchPages } from '../helpers/page'
import { fetchTemplates } from '../helpers/template'
import Cookies from 'js-cookie'

const onInput = (prop, dispatch) => value => {
  dispatch({ type: 'UPDATE_LOGIN_VALUE', prop, value })
}

const onSubmit = ({username, password}, dispatch) => ev => {
  ev.preventDefault()

  dispatch({ type: 'LOGGING_IN' })

  return fetch(`${GLOBALS.adminurl}/api/login`, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (res.status !== 200) {
        let error

        switch (res.status) {
          case 401:
            error = 'Wrong username or password'
            break
          default:
            error = 'Something unexpected happened'
            break
        }

        dispatch({ type: 'LOGGING_IN', loggingin: false, error })
        throw res.status
      }
      return res
    })
    .then(res => res.json())
    .then(({token, username}) => {
      Cookies.set('jungletoken', token, { expires: 30 })
      dispatch({ type: 'LOGGED_IN', token, username })

      fetchPages(dispatch)
      fetchTemplates(dispatch)
    })
}

let view = ({dispatch, login}) =>
  <div className='login-view'>
    <div className='logo-div' />
    <form onSubmit={onSubmit(login, dispatch)}>
      <TextInput label='Username' name='username' value={login.username} onChange={onInput('username', dispatch)} />
      <TextInput type='password' label='Password' name='password' value={login.password} onChange={onInput('password', dispatch)} />
      { login.error ? <p className='error'>{login.error}</p> : null }
      <ActionButton type='submit' label='Login' loading={login.loggingin} icon='sign-in' />
    </form>
  </div>

export default connect(state => state)(view)
