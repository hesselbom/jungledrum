export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_PAGE': return action.page || {}
    case 'SET_PAGES': return action.pages.find(p => p._id === state._id) || state
    case 'NEW_PAGE': return {
      _title: 'New page'
    }
    case 'SET_PAGE_TEMPLATE': return {
      ...state,
      _template: action.template
    }
    case 'UPDATE_PAGE_PROP': return {
      ...state,
      [action.prop]: action.value
    }
  }
  return state
}
