const toggleMenu = dispatch => () => dispatch({ type: 'TOGGLE_MENU' })

export default ({dispatch}) =>
  <a className='hamburger-button' onClick={toggleMenu(dispatch)}>
    <span className='fa fa-bars' />
  </a>
