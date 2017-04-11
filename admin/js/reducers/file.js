export default (state = {
  visible: false,
  add: false,
  image: false,
  loading: false,
  uploading: false,
  list: []
}, action) => {
  switch (action.type) {
    case 'LOADING_FILES': return {
      ...state,
      loading: action.loading == null ? true : action.loading
    }
    case 'LOADED_FILES': return {
      ...state,
      loading: false,
      list: action.list
    }
    case 'TOGGLE_ADD_FILE': return {
      ...state,
      add: !state.add
    }
    case 'START_UPLOAD': return {
      ...state,
      uploading: true
    }
    case 'UPLOAD_DONE': return {
      ...state,
      add: false,
      uploading: false,
      list: state.list.concat(action.file)
    }
    case 'SHOW_FILE': return {
      ...state,
      visible: true,
      image: !!action.image
    }
    case 'HIDE_FILE': return {
      ...state,
      visible: false
    }
    case 'SELECTED_FILE': return {
      ...state,
      visible: false
    }
  }
  return state
}
