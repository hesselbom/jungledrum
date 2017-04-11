import store from '../store'

let snackbarIds = 0
const SNACKBAR_TIMEOUT = 2000

export function addSnackbar (message, icon) {
  let id = ++snackbarIds
  store.dispatch({ type: 'ADD_SNACKBAR', message, icon, id })

  setTimeout(() => {
    store.dispatch({ type: 'HIDE_SNACKBAR', id })

    setTimeout(() =>
      store.dispatch({ type: 'REMOVE_SNACKBAR', id })
    , 300)
  }, SNACKBAR_TIMEOUT)
}
