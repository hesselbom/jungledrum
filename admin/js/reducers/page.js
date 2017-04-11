export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_PAGE': return {
      ...(action.page || {}),
      _clean: true
    }
    case 'SET_PAGES': return {
      ...(action.pages.find(p => p._id === state._id) || state),
      _clean: true
    }
    case 'NEW_PAGE': return {
      _title: 'New page'
    }
    case 'SET_PAGE_TEMPLATE': return {
      ...state,
      _template: action.template
    }
    case 'UPDATE_PAGE_PROP': return {
      ...state,
      [action.prop]: action.value,
      _clean: false
    }
    case 'SHOW_FILE': return {
      ...state,
      _fileprop: action.prop
    }
    case 'SELECTED_FILE': return state._fileprop ? {
      ...state,
      [state._fileprop]: action.file.name
    } : state
    case 'SET_CLEAN_PAGE': return {
      ...state,
      _clean: action.clean
    }
  }
  return state
}
