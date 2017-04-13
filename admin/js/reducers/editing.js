export default (state = {
  saving: false,
  deleting: false
}, action) => {
  switch (action.type) {
    case 'SET_SAVING': return {
      ...state,
      saving: action.saving
    }
    case 'SET_DELETING': return {
      ...state,
      deleting: action.deleting
    }
  }
  return state
}
