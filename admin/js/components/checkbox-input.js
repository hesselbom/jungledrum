export default ({label, name, checked, onChange}) =>
  <div className='checkbox-input'>
    <input type='checkbox' id={name} name={name} checked={checked} onChange={onChange && (ev => onChange(!!ev.target.checked))} />
    <label for={name}>{label}</label>
  </div>
