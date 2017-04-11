export default ({label, name, value, onChange, uploads}) =>
  <div className='image-input'>
    <label for={name}>{label}</label>
    <div className='fields'>
      {value && value !== '-'
        ? <div className='image'>
          <img src={'/' + uploads + '/' + value} className='image' />
        </div>
        : null}
      <div className='input'>
        <input type='file' accept='image/*' id={name} name={name} onChange={onChange} />
      </div>
    </div>
  </div>
