import { h, Component } from 'preact'
import shortid from 'shortid'

export default class CustomInput extends Component {
  componentWillMount () {
    this.containerId = `custom-${shortid.generate()}`
  }

  shouldComponentUpdate (props) {
    return props.instance.hyperscript || props.type !== this.props.type || props.value !== this.props.value
  }

  onChange = () => {
    this.props.onChange(this.props.instance.getValue())
  }

  render ({label, name, value, instance}) {
    if (instance.setup) {
      setTimeout(() => instance.setup(this.ref), 0)
    }

    return <div className='custom-input' id={this.containerId}>
      <label for={name}>{label}</label>
      <div
        className='markup'
        ref={r => { this.ref = r }}
        dangerouslySetInnerHTML={instance.render ? {__html: instance.render(value, { containerId: this.containerId })} : null}
      />
      {instance.hyperscript(h, value, this.onChange)}
    </div>
  }
}
