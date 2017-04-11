export default ({label, name, value, onChange, ...props}) =>
  <div className='text-input'>
    <label for={name}>{label}</label>
    <input type='text' id={name} name={name} value={value} onInput={onChange && (ev => onChange(ev.target.value))} {...props} />
  </div>
