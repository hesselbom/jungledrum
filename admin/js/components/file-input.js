import ActionButton from '../components/action-button'

export default ({label, name, value, onChange, onSelectFile}) =>
  <div className='file-input'>
    <label for={name}>{label}</label>
    {value && value !== '-' ? <p className='value'>
      {value}
      <ActionButton label='Clear' title='Clear field' icon='close' tiny gray onClick={() => onChange(null)} />
    </p> : null}
    <div className='input'>
      <button className='button' onClick={() => onSelectFile(false)}>Select file</button>
    </div>
  </div>
