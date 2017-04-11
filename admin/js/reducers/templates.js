export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_TEMPLATES': return action.templates
  }
  return state
}
