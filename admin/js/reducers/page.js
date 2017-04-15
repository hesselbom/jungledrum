const setProp = (state, prop, value) => {
  if (Array.isArray(prop)) {
    let newState = {
      ...state,
      _clean: false
    }

    let o = newState
    for (let i = 0; i < prop.length - 1; i++) {
      if (!o.hasOwnProperty(prop[i])) o[prop[i]] = {}
      if (typeof o[prop[i]] === 'string') {
        try { o[prop[i]] = JSON.parse(o[prop[i]]) } catch (err) { o[prop[i]] = {} }
      }
      o = o[prop[i]]
    }
    o[prop[prop.length - 1]] = value

    return newState
  }

  return {
    ...state,
    [prop]: value,
    _clean: false
  }
}
export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_PAGE': return {
      ...(action.page || {}),
      _isNewPage: false,
      _clean: true
    }
    case 'SET_PAGES': return state._isNewPage
      ? {
        ...state,
        _clean: true
      }
      : {
        ...(action.pages.find(p => p._id === state._id) || {}),
        _clean: true
      }
    case 'NEW_PAGE': return {
      _title: 'New page',
      _isNewPage: true
    }
    case 'SET_PAGE_TEMPLATE': return {
      ...state,
      _template: action.template
    }
    case 'UPDATE_PAGE_PROP': return setProp(state, action.prop, action.value)
    case 'SHOW_FILE': return {
      ...state,
      _fileprop: action.prop
    }
    case 'SELECTED_FILE': return state._fileprop
      ? setProp(state, state._fileprop, action.file.name)
      : state
    case 'SET_CLEAN_PAGE': return {
      ...state,
      _clean: action.clean
    }
  }
  return state
}
