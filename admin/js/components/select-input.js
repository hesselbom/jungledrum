const _onChange = onChange => ev => onChange(ev.target.value)

export default ({label, name, options = [], value, onChange}) => {
  let selected = options.find(o => (o.value || o.id) === value)

  if (!selected && options.length > 0) {
    onChange(options[0].value)
  }

  return <div className='select-input'>
    <label for={name}>{label}</label>
    <select id={name} name={name} onChange={_onChange(onChange)} value={value}>
      {options.map(o =>
        <option key={o.value || o.id} value={o.value || o.id}>{o.label || o.name}</option>
      )}
    </select>
  </div>
}
