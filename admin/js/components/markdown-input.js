export default ({label, name, value, onChange}) =>
  <div className='text-input'>
    <label for={name}>{label}</label>
    <textarea id={name} name={name} value={value} onInput={onChange && (ev => onChange(ev.target.value))} rows={10} />
  </div>
