export default (state = {
  username: '',
  password: '',
  loggingin: false,
  error: ''
}, action) => {
  switch (action.type) {
    case 'UPDATE_LOGIN_VALUE': return {
      ...state,
      [action.prop]: action.value
    }
    case 'LOGGING_IN': return {
      ...state,
      loggingin: action.loggingin != null ? action.loggingin : true,
      error: action.error || ''
    }
    case 'LOGGED_IN': return {
      ...state,
      loggingin: false
    }
  }
  return state
}
