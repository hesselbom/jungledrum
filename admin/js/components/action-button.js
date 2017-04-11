import { Link } from 'preact-router'

export default ({href, label, icon, loading, active, onClick, type}) => {
  let Component = type != null ? 'button' : onClick ? 'a' : Link

  return <Component
    href={href}
    className={`action-button ${loading ? '-loading' : ''} ${active ? '-active' : ''}`}
    onClick={onClick}
    type={type}
  >
    <span className='text'>
      <span className={`icon fa fa-${icon}`} />
      <span className='text'>{label}</span>
    </span>
    <span className='loader'>
      <span className='loader-spinner' />
    </span>
  </Component>
}
