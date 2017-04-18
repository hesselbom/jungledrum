export default ({label, name, value, onChange, type = 'text', ...props}) =>
  <div className='text-input'>
    <label for={name}>{label}</label>
    <input type={type} id={name} name={name} value={value} onInput={onChange && (ev => onChange(ev.target.value))} {...props} />
  </div>
