import { getInput } from '../helpers/page'

import ActionButton from '../components/action-button'

const onAddItem = ({list, onChange}) => ev => {
  list.push('')
  onChange(JSON.stringify(list))
}

const onFileInput = (obj, path, onFileInputPath) => ev => {
  onFileInputPath(path)(ev)
}

const onInput = (list, i, onChange) => value => {
  list[i] = value
  onChange(JSON.stringify(list))
}

export default ({path, field, label, value, onChange, onFileInputPath}) => {
  let list
  try { list = JSON.parse(value) } catch (err) { list = [] }

  return <div className='input-list'>
    <label>{label}</label>
    <div className='list'>
      {list.map((item, i) => {
        let _path = (path ? `${path}$` : '') + i
        return getInput(
          field.field,
          item,
          {
            onInput: onInput(list, i, onChange),
            onFileInput: onFileInput(list, _path, onFileInputPath),
            onFileInputPath: onFileInputPath,
            path: _path
          }
        )
      })}
      <div className='add'><ActionButton label='Add item' icon='plus' onClick={onAddItem({list, onChange})} /></div>
    </div>
  </div>
}
