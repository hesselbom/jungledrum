export default ({label, name, value, onChange, uploads}) =>
  <div className='file-input'>
    <label for={name}>{label}</label>
    {value && value !== '-' ? <p className='value'>{value}</p> : null}
    <div className='input'>
      <input type='file' id={name} name={name} onChange={onChange} />
    </div>
  </div>
