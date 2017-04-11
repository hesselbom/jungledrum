export default (state = {
  open: false
}, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU': return {
      ...state,
      open: !state.open
    }
    case 'SET_PAGE':
    case 'NEW_PAGE':
    case 'CLOSE_MENU': return {
      ...state,
      open: false
    }
  }
  return state
}
