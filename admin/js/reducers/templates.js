export default (state = {
  templates: {},
  loading: false,
  errorLoading: false
}, action) => {
  switch (action.type) {
    case 'LOADING_TEMPLATES': return {
      ...state,
      loading: true
    }
    case 'SET_TEMPLATES': return {
      ...state,
      templates: action.templates,
      loading: false,
      errorLoading: false
    }
    case 'ERROR_TEMPLATES': return {
      ...state,
      loading: false,
      errorLoading: true
    }
    default: return state
  }
}
