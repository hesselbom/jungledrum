import { connect } from 'preact-redux'
import { Link } from 'preact-router'
import Cookies from 'js-cookie'
import ActionButton from '../components/action-button'
import SnackBar from '../components/snack-bar'
import history from '../history'

const onLogOut = (dispatch) => () => {
  dispatch({ type: 'LOGOUT' })
  Cookies.remove('jungletoken')
}

const onLogoClick = (dispatch) => () => {
  dispatch({ type: 'CLOSE_MENU' })
  history.push(`${GLOBALS.adminurl}/`)
}

let view = (props) => {
  let {templates, snackbars, pages, child, pageid, path, menu, user, dispatch} = props
  let templatesAvailable = Object.keys(templates.templates).length > 0

  return <div className={`app-view ${menu.open ? '-menuopen' : ''}`}>
    <div className='pages'>
      <div className='logo'>
        <a className='logo-div' onClick={onLogoClick(dispatch)} />
      </div>
      <div className='list'>
        { pages.loading || templates.loading
          ? <p className='message'>Loading pages...</p>
          : pages.errorLoading || templates.errorLoading
          ? <p className='message'>Error loading pages. Try refreshing.</p>
          : <ul className='pages-list'>
            {
              pages.list.map(page =>
                <li className={page._id === pageid ? '-active' : ''}>
                  <Link href={`${GLOBALS.adminurl}/page/${page._id}`}>
                    {page._title}
                    {page._home ? <span className='icon fa fa-home' /> : null}
                  </Link>
                </li>
              )
            }
          </ul> }
        {templatesAvailable
          ? <div className='add'><ActionButton label='Add page' title='Add page' icon='plus' href={`${GLOBALS.adminurl}/new`} active={path === `${GLOBALS.adminurl}/new`} /></div>
          : null}
      </div>
      {
        user.token
        ? <div className='info'>
          <p>Logged in as <strong>{user.username || '...'}</strong></p>
          <p className='logout'><a onClick={onLogOut(dispatch)}>&larr; Logout</a></p>
        </div>
        : null
      }
    </div>
    <div className='content'>
      {child && child(props)}
    </div>
    <div className='overlay' onClick={() => dispatch({ type: 'CLOSE_MENU' })} />
    <div className='snackbar-list'>
      {snackbars.reverse().map(bar => <SnackBar message={bar.message} icon={bar.icon} hidden={bar.hidden} />)}
    </div>
  </div>
}

export default connect(store => ({
  pages: store.pages,
  templates: store.templates,
  snackbars: store.snackbars,
  menu: store.menu,
  user: store.user
}))(view)
