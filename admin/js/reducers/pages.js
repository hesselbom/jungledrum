export default (state = [], action) => {
  switch (action.type) {
    case 'SET_PAGES': return action.pages
  }
  return state
}
