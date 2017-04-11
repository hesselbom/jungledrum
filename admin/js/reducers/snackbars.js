export default (state = [], action) => {
  switch (action.type) {
    case 'ADD_SNACKBAR': return state.concat({
      id: action.id,
      message: action.message,
      icon: action.icon
    })
    case 'HIDE_SNACKBAR': return state.map(s => s.id === action.id ? {
      ...s,
      hidden: true
    } : s)
    case 'REMOVE_SNACKBAR': return state.filter(s => s.id !== action.id)
  }
  return state
}
