import ActionButton from '../components/action-button'

export default ({label, name, value, onChange, onSelectFile, uploads}) =>
  <div className='image-input'>
    <label for={name}>{label}</label>
    <div className='fields'>
      {value && value !== '-'
        ? <div className='image'>
          <img src={'/' + uploads + '/' + value} className='image' />
          <ActionButton label='Clear' title='Clear image' icon='close' tiny gray onClick={() => onChange(null)} />
        </div>
        : null}
      <div className='input'>
        <button className='button' onClick={() => onSelectFile(true)}>Select image</button>
      </div>
    </div>
  </div>
