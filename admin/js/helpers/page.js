import { objSwitch } from '../helpers/utils'
import TextInput from '../components/text-input'
import TextareaInput from '../components/textarea-input'
import MarkdownInput from '../components/markdown-input'
import ImageInput from '../components/image-input'
import FileInput from '../components/file-input'
import InputList from '../components/input-list'
import ObjectInput from '../components/object-input'
import CheckboxInput from '../components/checkbox-input'
import SelectInput from '../components/select-input'
import WysiwygInput from '../components/wysiwyg-input'
import CustomInput from '../components/custom-input'
import { addSnackbar } from './snackbars'
import history from '../history'
import { authJson, tokenHeader } from '../helpers/api'

export function fetchPages (dispatch) {
  return fetch(`${GLOBALS.adminurl}/api/pages`, {
    headers: { ...tokenHeader() }
  })
    .then(authJson)
    .then(pages => dispatch({ type: 'SET_PAGES', pages }))
    .catch(err => err.message === '401' ? dispatch({ type: 'LOGOUT' }) : null)
}

export function savePage (dispatch, data) {
  const isNew = !data._id
  const isStatic = !!data._static
  const pathAppend = isNew ? '' : `/${data._id}`
  const pathStatic = isStatic ? '/static' : ''

  dispatch({ type: 'SET_SAVING', saving: true })

  let dataKeys = Object.keys(data)
  let formData = new FormData()
  dataKeys.forEach(key => {
    if (key.indexOf('file__') === 0) return

    if (data['file__' + key]) {
      formData.append(key, data['file__' + key])
    } else {
      formData.append(key, data[key])
    }
  })

  return fetch(`${GLOBALS.adminurl}/api/pages${pathStatic}${pathAppend}`, {
    method: isNew ? 'POST' : 'PUT',
    body: formData,
    headers: { ...tokenHeader() }
  })
    .then(response => {
      if (isNew) {
        response.json()
          .then(data => {
            if (response.status === 200) {
              addSnackbar('Saved page', 'save')
              fetchPages(dispatch)
                .then(() => {
                  dispatch({ type: 'SET_SAVING', saving: false })
                  history.push(`${GLOBALS.adminurl}/page/${data._id}`)
                })
            } else {
              addSnackbar('Error saving page')
            }
          })
      } else {
        dispatch({ type: 'SET_SAVING', saving: false })

        if (response.status === 200) {
          addSnackbar('Saved page', 'save')
          fetchPages(dispatch)
        } else {
          addSnackbar('Error saving page')
        }
      }

      return response
    })
}

export function isInputCustom (type) {
  return !!plugins[type]
}

export function getInput (field, value, { onInput, onFileInput, onFileInputPath, path } = {}) {
  if (isInputCustom(field.type) && field.instance) {
    return <CustomInput
      field={field}
      label={field.name}
      name={field.id}
      id={field.id}
      onChange={onInput}
      value={value}
      type={field.type}
      instance={field.instance}
    />
  }

  return objSwitch(field.type, {
    'list': <InputList
      field={field}
      label={field.name}
      name={field.id}
      id={field.id}
      path={path != null ? path : field.id}
      onChange={onInput}
      onFileInputPath={onFileInputPath}
      value={value}
    />,
    'object': <ObjectInput
      field={field}
      label={field.name}
      name={field.id}
      id={field.id}
      path={path != null ? path : field.id}
      onChange={onInput}
      onFileInputPath={onFileInputPath}
      value={value}
    />,
    'wysiwyg': <WysiwygInput
      label={field.name}
      name={field.id}
      onChange={onInput}
      value={value}
    />,
    'image': <ImageInput
      label={field.name}
      name={field.id}
      onChange={onFileInput}
      value={value}
      uploads={GLOBALS.uploads}
    />,
    'file': <FileInput
      label={field.name}
      name={field.id}
      onChange={onFileInput}
      value={value}
      uploads={GLOBALS.uploads}
    />,
    'markdown': <MarkdownInput
      label={field.name}
      name={field.id}
      onChange={onInput}
      value={value}
    />,
    'textarea': <TextareaInput
      label={field.name}
      name={field.id}
      onChange={onInput}
      value={value}
    />,
    'checkbox': <CheckboxInput
      label={field.name}
      name={field.id}
      onChange={onInput}
      checked={value && value !== 'false'}
    />,
    'select': <SelectInput
      label={field.name}
      name={field.id}
      options={field.options}
      value={value}
      onChange={onInput}
    />,
    'default': <TextInput
      label={field.name}
      name={field.id}
      onChange={onInput}
      value={value}
    />
  })
}
