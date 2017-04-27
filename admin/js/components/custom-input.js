import { Component } from 'preact'
import shortid from 'shortid'

export default class CustomInput extends Component {
  shouldComponentUpdate (props) {
    return props.type !== this.props.type || props.value !== this.props.value
  }

  render ({label, name, value, instance}) {
    if (instance.setup) {
      setTimeout(() => instance.setup(this.ref), 0)
    }

    const containerId = `custom-${shortid.generate()}`

    return <div className='custom-input'>
      <label for={name}>{label}</label>
      <div
        id={containerId}
        className='markup'
        ref={r => { this.ref = r }}
        dangerouslySetInnerHTML={{__html: instance.render(value, { containerId })}}
      />
    </div>
  }
}
