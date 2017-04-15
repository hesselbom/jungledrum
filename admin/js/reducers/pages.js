export default (state = {
  list: [],
  loading: false,
  errorLoading: false
}, action) => {
  switch (action.type) {
    case 'LOADING_PAGES': return {
      ...state,
      loading: true
    }
    case 'SET_PAGES': return {
      ...state,
      list: action.pages,
      loading: false,
      errorLoading: false
    }
    case 'ERROR_PAGES': return {
      ...state,
      loading: false,
      errorLoading: true
    }
    default: return state
  }
}
