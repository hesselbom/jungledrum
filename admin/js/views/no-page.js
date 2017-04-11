import HamburgerButton from '../components/hamburger-button'
import { connect } from 'preact-redux'

let view = ({dispatch}) =>
  <div className='no-page'>
    <header className='page-header'>
      <HamburgerButton dispatch={dispatch} />
    </header>
    <div className='content'>
      <p>No page selected.</p>
    </div>
  </div>

export default connect()(view)
