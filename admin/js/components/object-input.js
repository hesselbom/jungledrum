import { getInput } from '../helpers/page'

const onFileInput = (obj, path, onFileInputPath) => ev => {
  onFileInputPath(path)(ev)
}

const onInput = (obj, id, onChange) => value => {
  obj[id] = value
  onChange(JSON.stringify(obj))
}

export default ({path, field, label, value, onChange, onFileInputPath}) => {
  let obj
  try { obj = JSON.parse(value) } catch (err) { obj = {} }

  return <div className='object-input'>
    <label>{label}</label>
    <div className='fields'>
      {field.fields.map((f, i) => {
        let _path = (path ? `${path}$` : '') + f.id
        return getInput(
          f,
          obj[f.id],
          {
            onInput: onInput(obj, f.id, onChange),
            onFileInput: onFileInput(obj, _path, onFileInputPath),
            onFileInputPath: onFileInputPath,
            path: _path
          }
        )
      })}
    </div>
  </div>
}
