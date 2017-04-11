export default (state = {
  token: null,
  username: ''
}, action) => {
  switch (action.type) {
    case 'LOGGED_IN': return {
      ...state,
      token: action.token,
      username: action.username
    }
    case 'USERNAME': return {
      ...state,
      username: action.username
    }
    case 'LOGOUT': return {
      ...state,
      token: null
    }
  }
  return state
}
