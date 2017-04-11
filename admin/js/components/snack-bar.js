export default ({message, icon, hidden}) =>
  <div className={`snack-bar ${hidden ? '-hidden' : ''}`}>
    {icon ? <span className={`icon fa fa-${icon}`} /> : null}
    <span className='message'>{message}</span>
  </div>
