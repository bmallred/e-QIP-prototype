import React from 'react'
import ValidationElement from '../ValidationElement'
import Street from '../Street'
import MilitaryState from '../MilitaryState'
import City from '../City'
import Country from '../Country'
import ZipCode from '../ZipCode'
import RadioGroup from '../RadioGroup'
import Radio from '../Radio'
import ApoFpo from '../ApoFpo'
import { api } from '../../../services/api'
import { Help, HelpIcon } from '../Help'

export default class Address extends ValidationElement {
  constructor (props) {
    super(props)
    let addressType = this.addressType()

    this.state = {
      value: props.value,
      address: props.address,
      city: props.city,
      state: props.state,
      zipcode: props.zipcode,
      apoFpo: props.apoFpo,
      country: props.country,
      focus: props.focus || false,
      error: props.error || false,
      valid: props.valid || false,
      addressType: addressType,
      apoFpoType: props.apoFpoType
    }
  }

  addressType () {
    let addressType = this.props.addressType
    if (!addressType && this.props.country === 'United States') {
      addressType = this.props.country
    }
    if (!addressType) {
      addressType = 'United States'
    }
    return addressType
  }

  /**
   * Handle the change event.
   */
  handleChange (field, event) {
    this.setState({ [field]: event.target.value }, () => {
      super.handleChange(event)
      if (this.props.onUpdate) {
        this.props.onUpdate({
          name: this.props.name,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          zipcode: this.state.zipcode,
          country: this.state.country,
          addressType: this.state.addressType,
          apoFpo: this.state.apoFpo,
          apoFpoType: this.state.apoFpoType
        })
      }
    })
  }

  /**
   * Handle the validation event.
   */
  handleValidation (event, status) {
    this.setState({error: status === false, valid: status === true}, () => {
      if (this.state.error === false || this.state.valid === true) {
        super.handleValidation(event, status)
        return
      }

      api
        .validateAddress({
          Address: [this.state.address1, this.state.address2].join(', '),
          City: this.state.city,
          State: this.state.state,
          Zipcode: this.state.zipcode,
          Country: this.state.country
        })
        .then((response) => {
          // TODO: Display and assign the errors as necessary
          if (response.Errors) {
            this.setState({
              error: response.Error.length > 0,
              valid: response.Errors.length === 0
            })
          }

          // TODO: Display suggestions
          if (response.Suggestions) {
          }
        })
        .then(() => {
          super.handleValidation(event, status)
        })
    })
  }

  /**
   * Generated name for the part of the address elements.
   */
  partName (part) {
    return '' + this.props.name + '-' + part
  }

  usAddress () {
    return (
      <div>
        <Street name="address"
          className="mailing"
          label="Mailing Address"
          placeholder="Enter mailing address"
          value={this.state.address}
          onChange={this.handleChange.bind(this, 'address')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <City name="city"
          className="city"
          label="City"
          placeholder="Enter city"
          value={this.state.city}
          onChange={this.handleChange.bind(this, 'city')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <div className="state-zip-wrap">
          <MilitaryState name="state"
            className="state"
            label="State"
            placeholder="Enter state"
            value={this.state.state}
            includeStates="true"
            onChange={this.handleChange.bind(this, 'state')}
            onValidate={this.handleValidation}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
          />
          <ZipCode name="zipcode"
            className="zipcode"
            label="Zipcode"
            placeholder="Enter zipcode"
            value={this.state.zipcode}
            onChange={this.handleChange.bind(this, 'zipcode')}
            onValidate={this.handleValidation}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
          />
        </div>
      </div>
    )
  }

  internationalAddress () {
    return (
      <div>
        <Street name="address"
          label="Mailing Address"
          className="mailing"
          placeholder="Enter mailing address"
          value={this.state.address}
          onChange={this.handleChange.bind(this, 'address')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <City name="city"
          label="City"
          placeholder="Enter city"
          value={this.state.city}
          onChange={this.handleChange.bind(this, 'city')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <Country name="country"
          label="Country"
          placeholder="Enter country"
          value={this.state.country}
          onChange={this.handleChange.bind(this, 'country')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
      </div>
    )
  }

  apoFpoAddress () {
    return (
      <div>
        <Street name="address"
          className="mailing"
          label="Mailing Address"
          placeholder="Enter mailing address"
          value={this.state.address}
          onChange={this.handleChange.bind(this, 'address')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <City name="city"
          label="City"
          placeholder="Enter city"
          value={this.state.city}
          onChange={this.handleChange.bind(this, 'city')}
          onValidate={this.handleValidation}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
        />
        <div>Select APO or FPO</div>
        <RadioGroup className="apofpo" selectedValue={this.state.apoFpoType}>
          <Radio name="addressType"
            label="APO"
            value="APO"
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'apoFpoType')}
            onValidate={this.props.onValidate}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
          />
          <Radio name="addressType"
            label="FPO"
            value="FPO"
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'apoFpoType')}
            onValidate={this.props.onValidate}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
          />
        </RadioGroup>
        <div className="state-zip-wrap">
          <ZipCode name="zipcode"
            className="zipcode"
            label="Zipcode"
            placeholder="Enter zipcode"
            value={this.state.zipcode}
            onChange={this.handleChange.bind(this, 'zipcode')}
            onValidate={this.handleValidation}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
          />
          <ApoFpo name="apoFpo"
            label="APO/FPO"
            value={this.state.apoFpo}
            onChange={this.handleChange.bind(this, 'apoFpo')}
            onValidate={this.handleValidation}
            onFocus={this.props.onFocus}
            onBlur={this.props.onBlur}
          />
        </div>
      </div>
    )
  }

  render () {
    const klass = `address ${this.props.className || ''}`.trim()

    return (
      <div className={klass}>
        <label>{this.props.label}</label>
        <RadioGroup className="address-options" selectedValue={this.state.addressType}>
          <Radio name="addressType"
            label="In the United States"
            value="United States"
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'addressType')}
            onValidate={this.props.onValidate}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
          />
          <Radio name="addressType"
            label="APO/FPO"
            value="APOFPO"
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'addressType')}
            onValidate={this.props.onValidate}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
          />
          <Radio name="addressType"
            label="Outside of the United States"
            value="International"
            disabled={this.props.disabled}
            onChange={this.handleChange.bind(this, 'addressType')}
            onValidate={this.props.onValidate}
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
          />
        </RadioGroup>
        <div className="fields">
          {this.state.addressType === 'United States' && this.usAddress()}
          {this.state.addressType === 'International' && this.internationalAddress()}
          {this.state.addressType === 'APOFPO' && this.apoFpoAddress()}
        </div>
      </div>
    )
  }
}
