import { Component } from 'preact'
import cn from 'classnames'
import ActionButton from './action-button'
import { authJson, tokenHeader } from '../helpers/api'

const isImage = file => {
  let ext = file.substr(file.lastIndexOf('.') + 1).toLowerCase()
  return ['jpg', 'jpeg', 'svg', 'png', 'gif'].indexOf(ext) > -1
}

export default class FileModal extends Component {
  componentWillMount () {
    this.loadFiles()
  }

  loadFiles () {
    this.props.dispatch({ type: 'LOADING_FILES' })

    return fetch(`${GLOBALS.adminurl}/api/files`, {
      headers: { ...tokenHeader() }
    })
      .then(authJson)
      .then(list => {
        this.props.dispatch({ type: 'LOADED_FILES', list })
      })
  }

  onUpload (ev) {
    this.props.dispatch({ type: 'START_UPLOAD' })
    ev.preventDefault()

    let body = new FormData()
    body.append('file', this.fileinput.files[0])

    return fetch(`${GLOBALS.adminurl}/api/file`, {
      method: 'POST',
      body,
      headers: { ...tokenHeader() }
    })
      .then(authJson)
      .then(file => {
        this.props.dispatch({ type: 'UPLOAD_DONE', file })
      })
  }

  render ({dispatch, file}) {
    let list = <p className='empty'>No files uploaded yet</p>

    if (file.list.length > 0) {
      list = <ul>
        {
          file.list
            .filter(f => file.image ? isImage(f.name) : true)
            .map(f => <li><a onClick={() => dispatch({ type: 'SELECTED_FILE', file: f })}>{f.name}</a></li>)
        }
      </ul>
    }

    return <div className={cn('file-modal', { '-visible': file.visible })}>
      <div className='modal'>
        <header className='header'>
          <h1>Files</h1>
          <a className='close fa fa-close' onClick={() => dispatch({ type: 'HIDE_FILE' })} />
        </header>
        <div className='body'>
          {
            file.loading
            ? <p className='loading'>Loading files...</p>
            : file.uploading
            ? <p className='uploading'>Uploading...</p>
            : file.add
            ? <form onSubmit={ev => this.onUpload(ev)}>
              <input type='file' accept={file.image ? 'image/*' : null} ref={r => { this.fileinput = r }} />
              <button type='submit'>Upload</button>
            </form>
            : list
          }
        </div>
        <footer className='footer'>
          <ActionButton label='Add file' icon='plus' onClick={() => dispatch({ type: 'TOGGLE_ADD_FILE' })} />
        </footer>
      </div>
    </div>
  }
}
