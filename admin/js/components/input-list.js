import { getInput } from '../helpers/page'

import ActionButton from '../components/action-button'

const onAddItem = ({list, onChange}) => ev => {
  list.push('')
  onChange(list)
}

const onInput = (list, i, onChange) => value => {
  list[i] = value
  onChange(list)
}

export default ({path, field, label, value, onChange, onSelectFile, getCustomField}) => {
  let list = value || []
  let subfield = field.field || { type: 'text' }
  if (typeof value === 'string') {
    try { list = JSON.parse(value) } catch (err) { list = [] }
  }

  return <div className='input-list'>
    <label>{label}</label>
    <div className='list'>
      {list.map((item, i) => {
        let _path = (path || []).concat(i)
        return <div className='item'>
          {getInput(
            getCustomField(_path, subfield),
            item,
            {
              onInput: onInput(list, i, onChange),
              onSelectFile,
              path: _path,
              getCustomField
            }
          )}
        </div>
      })}
      <div className='add'><ActionButton label='Add item' icon='plus' onClick={onAddItem({list, onChange})} /></div>
    </div>
  </div>
}
