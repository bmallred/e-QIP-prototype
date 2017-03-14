import React from 'react'
import { Branch } from '../../Form'
import { newGuid } from '../ValidationElement/ValidationElement'

export default class BranchCollection extends React.Component {
  constructor (props) {
    super(props)

    let indices = []
    for (let i = 0; i < this.props.items.length; i++) {
      indices.push(newGuid())
    }

    this.state = {
      indices: indices
    }

    this.content = this.content.bind(this)
    this.updateIndices = this.updateIndices.bind(this)
  }

  updateIndices (indices, fn) {
    this.setState({ indices: indices }, () => {
      if (fn) {
        fn()
      }
    })
  }

  /**
   * Updates existing selected branch values
   */
  onBranchClick (item, index, yes) {
    let items = [...this.props.items]
    item[this.props.valueKey] = yes
    items[index] = item

    // If it's not the first item, remove it when user selects no if `removeable` flag is turned on
    if (this.props.items.length > 1 && this.props.removable && yes === 'No') {
      items.splice(index, 1)

      let indices = [...this.state.indices]
      indices.splice(index, 1)
      this.updateIndices(indices)
    }

    this.props.onUpdate(items)
  }

  /**
   * Used when populating branch values for the first time
   */
  onDefaultBranchClick (yes) {
    let item = {
      [this.props.valueKey]: yes
    }
    let items = [item]
    let indices = [newGuid()]
    this.updateIndices(indices, () => { this.props.onUpdate(items) })
  }

  /**
   * Used when a user decides to add new information. This refers to the last displayed yes/no branch
   */
  onLastBranchClick (yes) {
    let item = {
      [this.props.valueKey]: yes
    }
    if (yes === 'Yes') {
      let items = [...this.props.items]
      items.push(item)
      let indices = [...this.state.indices]
      indices.push(newGuid())
      this.updateIndices(indices, () => { this.props.onUpdate(items) })
    }
  }

  recursiveCloneChildren (children, item, index) {
    return React.Children.map(children, child => {
      var childProps = {}
      if (React.isValidElement(child)) {
        if (child.props.bind) {
          let field = item[child.props.name]
          childProps = {...field}
          childProps.onUpdate = (value) => {
            let items = [...this.props.items]
            items[index][child.props.name] = value
            this.props.onUpdate(items)
          }
        }
      }

      const typeOfChildren = Object.prototype.toString.call(child.props.children)
      if (child.props.children && ['[object Object]', '[object Array]'].includes(typeOfChildren)) {
        childProps.children = this.recursiveCloneChildren(child.props.children, item, index)
      }

      return React.cloneElement(child, childProps)
    })
  }

  /**
   * Helper that renders branch information. Allows props to be overriden
   */
  branch (props) {
    return (
      <Branch
        helpClassName="eapp-field-wrap"
        name={this.props.branchName}
        help={this.props.branchHelp}
        onValidate={this.props.onValidate}
        {...props}
        >
        {this.props.branch}
      </Branch>
    )
  }

  content () {
    // When no items are present, render default branch yes/no
    if (this.props.items.length === 0) {
      return (
        <div key={this.state.indices[0]}>
          {
            this.branch({
              onUpdate: this.onDefaultBranchClick.bind(this)
            })
          }
        </div>
      )
    }

    // If a branch has been selected but it has a `No` value, rather than deleting, we'll update
    // its value
    if (this.props.items.length === 1 && this.props.items[0][this.props.valueKey] === 'No') {
      var item = this.props.items[0]
      return (
        <div key={this.state.indices[0]}>
          {
            this.branch({
              value: 'No',
              onUpdate: this.onBranchClick.bind(this, item, 0)
            })
          }
        </div>
      )
    }

    // When more than 1 item is in
    const top = (index, item) => {
      return this.branch({
        value: item[this.props.valueKey],
        onUpdate: this.onBranchClick.bind(this, item, index)
      })
    }

    // Render the branch question at the very end
    const bottom = (index, item) => {
      return this.props.items.length - 1 === index
        ? this.branch({
          className: 'last-branch',
          onUpdate: this.onLastBranchClick.bind(this)
        })
      : null
    }

    const kiddos = (index, item) => {
      return item[this.props.valueKey] && item[this.props.valueKey] === 'Yes'
        ? this.recursiveCloneChildren(this.props.children, item, index)
        : null
    }

    const rows = this.props.items.map((item, index) => {
      return (
        <div key={this.state.indices[index]}>
          { top(index, item) }
          <div>{ kiddos(index, item) }</div>
          { bottom(index, item) }
        </div>
      )
    })

    return (<div>{rows}</div>)
  }

  render () {
    return (
      <div className={this.props.className}>
        {this.content()}
      </div>
    )
  }
}

BranchCollection.defaultProps = {
  // Items in the collection to render
  items: [],

  // If selecting No removes the item
  removable: true,

  // Input name for the supporting Branch component
  branchName: 'branchcollection',

  // Branch help id
  branchHelp: '',

  // Key name that stores whether yes/no has been selected
  valueKey: 'Has',

  onUpdate: () => {
    console.warn('onUpdate function not provided in BranchCollection. Please add one or your updates will not work')
  }
}
