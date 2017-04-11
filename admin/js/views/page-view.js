import { Component } from 'preact'
import { connect } from 'preact-redux'
// import history from '../history'
import TextInput from '../components/text-input'
import CheckboxInput from '../components/checkbox-input'
import SelectInput from '../components/select-input'
import ActionButton from '../components/action-button'
import HamburgerButton from '../components/hamburger-button'
import { savePage, getInput, isInputCustom } from '../helpers/page'

let setPageTemplate = dispatch => template => {
  dispatch({ type: 'SET_PAGE_TEMPLATE', template })
}

let onInput = (dispatch, prop) => value =>
  dispatch({ type: 'UPDATE_PAGE_PROP', prop, value })

let onFileInput = dispatch => path => ev => {
  if (ev.target.files.length > 0) {
    dispatch({ type: 'UPDATE_PAGE_PROP', prop: 'file__' + path, value: ev.target.files[0] })
    dispatch({ type: 'UPDATE_PAGE_PROP', prop: path, value: '-' })
  } else {
    dispatch({ type: 'UPDATE_PAGE_PROP', prop: 'file__' + path, value: null })
    dispatch({ type: 'UPDATE_PAGE_PROP', prop: path, value: null })
  }
}

class PageView extends Component {
  /*
  constructor () {
    super()

    // TODO: Make this work with images
    history.block((location, action) => {
      if (this.mounted && location.pathname !== history.location.pathname) {
        let initial = JSON.stringify(this.initial)
        let current = JSON.stringify(this.props.page)

        if (initial !== current) {
          return 'You have unsaved changes, are you sure you want to leave this page?'
        }
      }
    })
  }
  */

  populateCustomFields (page) {
    let templateKeys = Object.keys(this.props.templates)
    let templateKey = page._template || templateKeys[0]
    let template = this.props.templates[templateKey] || {}
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
        .then(response => {
          if (response.status === 200) {
            this.initial = { ...data }
          }
        })
    }
  }

  componentWillMount () {
    this.mounted = true
    this.setupCustomFields(this.props)
  }

  componentWillUnmount () {
    this.mounted = false
  }

  componentWillReceiveProps (props) {
    if (props.page && ((!this.props.page || props.page._id !== this.props.page._id) || !this.initial)) {
      this.initial = { ...props.page }
      this.setupCustomFields(props)
    }
  }

  setupCustomFields (props) {
    if (!props.templates) return

    let templateKeys = Object.keys(props.templates)
    let templateKey = props.page._template || templateKeys[0]
    let template = props.templates[templateKey] || {}
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

  render ({page, templates, editing, newPage = false, dispatch}) {
    if (!page) {
      return <section className='no-page'>
        <p>Page not found</p>
      </section>
    }

    // if (this.customFields == null) {
    //   this.setupCustomFields(this.props)
    // }

    let templateKeys = Object.keys(templates)
    let templateKey = page._template || templateKeys[0]
    let template = templates[templateKey] || {}
    let fields = (template.fields || [])

    return <section className='page-view'>
      <header className='page-header'>
        <HamburgerButton dispatch={dispatch} />
        <h1>{page._title}</h1>
        <div className='save'>
          <ActionButton label='Save' icon='save' onClick={this.onSavePage(dispatch, page, this)} loading={editing.saving} />
        </div>
      </header>
      <div className='content'>
        {templateKeys.length > 0 && !page._static
          ? <SelectInput
            label='Template'
            name='_template'
            options={templateKeys.map(key => ({ value: key, label: templates[key].name || key }))}
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
              onFileInput: onFileInput(dispatch)(field.id),
              onFileInputPath: onFileInput(dispatch)
            }
          ))
        }
      </div>
    </section>
  }
}

export default connect(store => ({
  page: store.page,
  templates: store.templates,
  editing: store.editing
}))(PageView)
