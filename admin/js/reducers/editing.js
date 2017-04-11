export default (state = {
  saving: false
}, action) => {
  switch (action.type) {
    case 'SET_SAVING': return {
      ...state,
      saving: action.saving
    }
  }
  return state
}
