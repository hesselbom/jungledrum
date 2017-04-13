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

function encodeJson (data) {
  let d = {}
  Object.keys(data).forEach(key => {
    let value = data[key]
    if (value && typeof value !== 'string') {
      d[key] = JSON.stringify(value)
    } else {
      d[key] = value
    }
  })
  return d
}

export function deletePage (dispatch, id) {
  dispatch({ type: 'SET_DELETING', deleting: true })

  return fetch(`${GLOBALS.adminurl}/api/pages/${id}`, {
    method: 'DELETE',
    headers: { ...tokenHeader() }
  })
    .then(res => {
      dispatch({ type: 'SET_DELETING', deleting: false })

      if (res.status === 200) {
        addSnackbar('Deleted page', 'save')
        fetchPages(dispatch)
        dispatch({ type: 'SET_CLEAN_PAGE', clean: true })
        setTimeout(() => history.push(`${GLOBALS.adminurl}`) , 50)
      } else {
        addSnackbar('Error deleting page')
      }
    })
}

export function savePage (dispatch, data) {
  const isNew = !data._id
  const isStatic = !!data._static
  const pathAppend = isNew ? '' : `/${data._id}`
  const pathStatic = isStatic ? '/static' : ''

  dispatch({ type: 'SET_SAVING', saving: true })

  // Encode arrays and objects to json strings
  data = encodeJson(data)

  return fetch(`${GLOBALS.adminurl}/api/pages${pathStatic}${pathAppend}`, {
    method: isNew ? 'POST' : 'PUT',
    body: JSON.stringify(data),
    headers: {
      ...tokenHeader(),
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (isNew) {
        res.json()
          .then(data => {
            if (res.status === 200) {
              addSnackbar('Saved page', 'save')
              fetchPages(dispatch)
                .then(() => {
                  dispatch({ type: 'SET_SAVING', saving: false })
                  dispatch({ type: 'SET_CLEAN_PAGE', clean: true })
                  setTimeout(() =>
                    history.push(`${GLOBALS.adminurl}/page/${data._id}`)
                  , 50)
                })
            } else {
              addSnackbar('Error saving page')
            }
          })
      } else {
        dispatch({ type: 'SET_SAVING', saving: false })

        if (res.status === 200) {
          addSnackbar('Saved page', 'save')
          fetchPages(dispatch)
        } else {
          addSnackbar('Error saving page')
        }
      }

      return res
    })
}

export function isInputCustom (type) {
  return !!plugins[type]
}

export function getInput (field, value, { onInput, path, onSelectFile } = {}) {
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
      path={path != null ? path : [field.id]}
      onChange={onInput}
      onSelectFile={onSelectFile}
      value={value}
    />,
    'object': <ObjectInput
      field={field}
      label={field.name}
      name={field.id}
      id={field.id}
      path={path != null ? path : [field.id]}
      onChange={onInput}
      onSelectFile={onSelectFile}
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
      onChange={onInput}
      onSelectFile={onSelectFile(path != null ? path : field.id)}
      value={value}
      uploads={GLOBALS.uploads}
    />,
    'file': <FileInput
      label={field.name}
      name={field.id}
      onChange={onInput}
      onSelectFile={onSelectFile(path != null ? path : field.id)}
      value={value}
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
