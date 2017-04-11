import { authJson, tokenHeader } from '../helpers/api'

export function fetchTemplates (dispatch) {
  return fetch(`${GLOBALS.adminurl}/api/templates`, {
    headers: { ...tokenHeader() }
  })
    .then(authJson)
    .then(templates => dispatch({ type: 'SET_TEMPLATES', templates: templates }))
    .catch(err => err.message === '401' ? dispatch({ type: 'LOGOUT' }) : null)
}
