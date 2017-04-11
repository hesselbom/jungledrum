export default ({label, name, value, onChange, onSelectFile}) =>
  <div className='file-input'>
    <label for={name}>{label}</label>
    {value && value !== '-' ? <p className='value'>{value}</p> : null}
    <div className='input'>
      <button className='button' onClick={() => onSelectFile(false)}>Select file</button>
    </div>
  </div>
