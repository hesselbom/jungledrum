import { connect } from 'preact-redux'
import { Link } from 'preact-router'
import Cookies from 'js-cookie'
import ActionButton from '../components/action-button'
import SnackBar from '../components/snack-bar'

const onLogOut = (dispatch) => () => {
  dispatch({ type: 'LOGOUT' })
  Cookies.remove('jungletoken')
}

let view = ({templates, snackbars, pages, children, pageid, path, menu, user, dispatch}) => {
  let templatesAvailable = Object.keys(templates).length > 0

  return <div className={`app-view ${menu.open ? '-menuopen' : ''}`}>
    <div className='pages'>
      <div className='logo'><div className='logo-div' /></div>
      <div className='list'>
        <ul className='pages-list'>
          {
            pages.map(page =>
              <li className={page._id === pageid ? '-active' : ''}>
                <Link href={`${GLOBALS.adminurl}/page/${page._id}`}>
                  {page._title}
                  {page._home ? <span className='icon fa fa-home' /> : null}
                </Link>
              </li>
            )
          }
        </ul>
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
      {children}
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
