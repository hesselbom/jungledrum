import { render } from 'preact'
import { Router } from 'preact-router'
import { Provider, connect } from 'preact-redux'
import store from './store'
import history from './history'
import Cookies from 'js-cookie'

import LoginView from './views/login-view'
import AppView from './views/app-view'
import NoPage from './views/no-page'
import PageView from './views/page-view'

import { authJson, tokenHeader } from './helpers/api'
import { fetchPages } from './helpers/page'
import { fetchTemplates } from './helpers/template'

const setPage = (pageid) => {
  let { pages } = store.getState()
  let page = pages.find(p => p._id === pageid) || { _id: pageid }
  store.dispatch({ type: 'SET_PAGE', page: page })
}
const newPage = () => store.dispatch({ type: 'NEW_PAGE' })
const onRouteChange = (props) => {
  let attr = props.current.attributes

  switch (attr.path) {
    case GLOBALS.adminurl + '/page/:pageid': return setPage(attr.pageid)
    case GLOBALS.adminurl + '/new': return newPage()
  }
}
const LoggedIn = connect(state => state)(
  ({user, children}) => user.token ? children[0] : <LoginView />
)

if (Cookies.get('jungletoken')) {
  store.dispatch({ type: 'LOGGED_IN', token: Cookies.get('jungletoken') })

  fetch(`${GLOBALS.adminurl}/api/me`, {
    headers: { ...tokenHeader() }
  })
    .then(authJson)
    .then(({username}) => store.dispatch({ type: 'USERNAME', username }))

  fetchPages(store.dispatch)
  fetchTemplates(store.dispatch)
}

const routes = (
  <Provider store={store}>
    <LoggedIn>
      <Router onChange={onRouteChange} history={history}>
        <AppView path={`${GLOBALS.adminurl}/page/:pageid`} children={<PageView />} />
        <AppView path={`${GLOBALS.adminurl}/new`} children={<PageView newPage />} />
        <AppView default children={<NoPage />} />
      </Router>
    </LoggedIn>
  </Provider>
)

render(routes, document.getElementById('app'))
