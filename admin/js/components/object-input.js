import { getInput } from '../helpers/page'

const onInput = (obj, id, onChange) => value => {
  obj[id] = value
  onChange(obj)
}

export default ({path, field, label, value, onChange, onSelectFile, getCustomField, clearCustomField}) => {
  let obj = value || {}
  if (typeof value === 'string') {
    try { obj = JSON.parse(value) } catch (err) { obj = {} }
  }

  return <div className='object-input'>
    <label>{label}</label>
    <div className='fields'>
      {field.fields.map((f, i) => {
        let _path = (path || []).concat(f.id)
        return getInput(
          getCustomField(_path, f),
          obj[f.id],
          {
            onInput: onInput(obj, f.id, onChange),
            onSelectFile,
            path: _path,
            getCustomField,
            clearCustomField
          }
        )
      })}
    </div>
  </div>
}
