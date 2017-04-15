import { Component } from 'preact'
import { connect } from 'preact-redux'
// import history from '../history'
import TextInput from '../components/text-input'
import CheckboxInput from '../components/checkbox-input'
import SelectInput from '../components/select-input'
import ActionButton from '../components/action-button'
import HamburgerButton from '../components/hamburger-button'
import FileModal from '../components/file-modal'
import { deletePage, savePage, getInput, isInputCustom } from '../helpers/page'

let setPageTemplate = dispatch => template => {
  dispatch({ type: 'SET_PAGE_TEMPLATE', template })
}

let onInput = (dispatch, prop) => value => {
  dispatch({ type: 'UPDATE_PAGE_PROP', prop, value })
}

let onSelectFile = dispatch => prop => image =>
  dispatch({ type: 'SHOW_FILE', image, prop })

class PageView extends Component {
  /*
  constructor () {
    super()

    // Commented out until preact-router bug is fixed (https://github.com/developit/preact-router/pull/140)

    history.block((location, action) => {
      if (this.mounted && location.pathname !== history.location.pathname) {
        if (this.props.page._clean === false) {
          return 'You have unsaved changes, are you sure you want to leave this page?'
        }
      }
    })
  }
  */

  populateCustomFields (page) {
    let templateKeys = Object.keys(this.props.templates.templates)
    let templateKey = page._template || templateKeys[0]
    let template = this.props.templates.templates[templateKey] || {}
    let fields = (template.fields || [])
    let data = { ...page }

    fields.forEach((_, i) => {
      let field = this.customFields[i]
      if (field && field.instance) {
        data[field.id] = field.instance.getValue()
      }
    })

    return data
  }

  onSavePage (dispatch, page) {
    return ev => {
      let data = this.populateCustomFields(page)
      savePage(dispatch, data)
    }
  }

  onDeletePage (dispatch, page) {
    return ev => {
      if (window.confirm('Are you sure you want to delete this page?')) {
        deletePage(dispatch, page._id)
      }
    }
  }

  componentWillMount () {
    this.mounted = true
    this.setupCustomFields(this.props)
  }

  componentWillUnmount () {
    this.mounted = false
  }

  setupCustomFields (props) {
    if (!(props.templates && props.templates.templates)) return

    let templateKeys = Object.keys(props.templates.templates)
    let templateKey = props.page._template || templateKeys[0]
    let template = props.templates.templates[templateKey] || {}
    let fields = (template.fields || [])

    this.customFields = []

    fields.forEach((field, i) => {
      if (isInputCustom(field.type)) {
        let plugin = plugins[field.type]
        let instance = plugin && plugin.field && plugin.field()

        if (instance && instance.render && instance.getValue) {
          this.customFields[i] = {
            ...field,
            instance
          }
        }
      }
    })
  }

  render ({page, pages, templates, editing, newPage = false, file, dispatch}) {
    if (pages.errorLoading || templates.errorLoading) {
      return <section className='no-page'>
        <header className='page-header'>
          <HamburgerButton dispatch={dispatch} />
        </header>
        <div className='content'><p>Error loading pages. Try refreshing.</p></div>
      </section>
    }

    if (!page || (!page._isNewPage && !page._id)) {
      return <section className='no-page'>
        <header className='page-header'>
          <HamburgerButton dispatch={dispatch} />
        </header>
        <div className='content'><p>Page not found</p></div>
      </section>
    }

    if (this.customFields == null || this.customFields.length === 0) {
      this.setupCustomFields(this.props)
    }

    let templateKeys = Object.keys(templates.templates)
    let templateKey = page._template || templateKeys[0]
    let template = templates.templates[templateKey] || {}
    let fields = (template.fields || [])

    return <section className='page-view'>
      <header className='page-header'>
        <HamburgerButton dispatch={dispatch} />
        <h1>{page._title}</h1>
        <div className='actions'>
          {
            !page._static && !newPage &&
            <ActionButton label='Delete' title='Delete page' icon='close' onClick={this.onDeletePage(dispatch, page, this)} loading={editing.deleting} disabled={editing.saving} small red />
          }
          <ActionButton label='Save' title='Save page' icon='save' onClick={this.onSavePage(dispatch, page, this)} loading={editing.saving} disabled={editing.deleting} />
        </div>
      </header>
      <div className='content'>
        {templateKeys.length > 0 && !page._static
          ? <SelectInput
            label='Template'
            name='_template'
            options={templateKeys.map(key => ({ value: key, label: templates.templates[key].name || key }))}
            value={templateKey}
            onChange={setPageTemplate(dispatch)}
          />
          : null}
        <CheckboxInput label='Is Homepage' name='_home' checked={page._home} onChange={onInput(dispatch, '_home')} />
        {!page._static ? <TextInput label='Title' name='_title' value={page._title} onChange={onInput(dispatch, '_title')} /> : null}
        {!page._static ? <TextInput label='Slug' name='_slug' value={page._slug} onChange={onInput(dispatch, '_slug')} /> : null}
        {
          fields.map((field, i) => getInput(
            (this.customFields && this.customFields[i]) || field,
            page[field.id],
            {
              onInput: onInput(dispatch, field.id),
              onSelectFile: onSelectFile(dispatch)
            }
          ))
        }
      </div>
      <FileModal file={file} dispatch={dispatch} uploads={GLOBALS.uploads} />
    </section>
  }
}

export default connect(store => ({
  page: store.page,
  pages: store.pages,
  templates: store.templates,
  editing: store.editing,
  file: store.file
}))(PageView)
