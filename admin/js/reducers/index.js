import { combineReducers } from 'redux'
import user from './user'
import login from './login'
import pages from './pages'
import page from './page'
import templates from './templates'
import editing from './editing'
import snackbars from './snackbars'
import menu from './menu'
import file from './file'

export default () => combineReducers({
  user,
  login,
  pages,
  page,
  templates,
  editing,
  snackbars,
  menu,
  file
})
