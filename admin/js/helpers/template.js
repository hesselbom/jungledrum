import { authJson, tokenHeader } from '../helpers/api'

export function fetchTemplates (dispatch) {
  dispatch({ type: 'LOADING_TEMPLATES' })

  return fetch(`${GLOBALS.adminurl}/api/templates`, {
    headers: { ...tokenHeader() }
  })
    .then(authJson)
    .then(templates => dispatch({ type: 'SET_TEMPLATES', templates }))
    .catch(error => error.message === '401'
      ? dispatch({ type: 'LOGOUT' })
      : dispatch({ type: 'ERROR_TEMPLATES', error }))
}
