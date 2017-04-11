export default ({label, name, value, onChange, onSelectFile, uploads}) =>
  <div className='image-input'>
    <label for={name}>{label}</label>
    <div className='fields'>
      {value && value !== '-'
        ? <div className='image'>
          <img src={'/' + uploads + '/' + value} className='image' />
        </div>
        : null}
      <div className='input'>
        <button className='button' onClick={() => onSelectFile(true)}>Select image</button>
      </div>
    </div>
  </div>
