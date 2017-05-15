import 'whatwg-fetch'

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
  let page = pages.list.find(p => p._id === pageid) || { _id: pageid }
  store.dispatch({ type: 'SET_PAGE', page })
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
  ({user, children}) =>
    user.token || GLOBALS.requiresLogin === false
    ? children[0]
    : <LoginView />
)

if (Cookies.get('jungletoken') || GLOBALS.requiresLogin === false) {
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
        <AppView path={`${GLOBALS.adminurl}/page/:pageid`} child={props => <PageView key={props.matches.pageid} />} />
        <AppView path={`${GLOBALS.adminurl}/new`} child={props => <PageView newPage />} />
        <AppView default child={props => <NoPage />} />
      </Router>
    </LoggedIn>
  </Provider>
)

render(routes, document.getElementById('app'))

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${GLOBALS.adminurl}/sw.js`, {
    scope: `${GLOBALS.adminurl}/`
  })
    .then(reg => console.log('Service Worker registered. Scope is ' + reg.scope))
    .catch(err => console.log('Service Worker could not register: ' + err))
}
