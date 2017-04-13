import { Link } from 'preact-router'
import cn from 'classnames'

export default ({href, label, icon, loading, active, onClick, type, small, tiny, gray, red, ...props}) => {
  let Component = type != null ? 'button' : onClick ? 'a' : Link

  return <Component
    href={href}
    className={cn('action-button', {
      '-loading': loading,
      '-active': active,
      '-small': small,
      '-tiny': tiny,
      '-gray': gray,
      '-red': red
    })}
    onClick={onClick}
    type={type}
    {...props}
  >
    <span className='text'>
      <span className={`icon fa fa-${icon}`} />
      <span className='text'>{label}</span>
    </span>
    { loading != null &&
      <span className='loader'>
        <span className='loader-spinner' />
      </span> }
  </Component>
}
