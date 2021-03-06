import React from 'react'
import { i18n } from '../../../config'
import {
  Location,
  ValidationElement,
  Field,
  Text,
  DateControl,
  BranchCollection,
  Svg,
  Show,
  AccordionItem
} from '../../Form'
import { AppealItem } from './AppealItem'

export default class Order extends ValidationElement {
  constructor(props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateOccurred = this.updateOccurred.bind(this)
    this.updateCourtName = this.updateCourtName.bind(this)
    this.updateCourtAddress = this.updateCourtAddress.bind(this)
    this.updateDisposition = this.updateDisposition.bind(this)
    this.updateAppeals = this.updateAppeals.bind(this)
  }

  update(queue) {
    this.props.onUpdate({
      Occurred: this.props.Occurred,
      CourtName: this.props.CourtName,
      CourtAddress: this.props.CourtAddress,
      Disposition: this.props.Disposition,
      Appeals: this.props.Appeals,
      ...queue
    })
  }

  updateOccurred(values) {
    this.update({
      Occurred: values
    })
  }

  updateCourtName(values) {
    this.update({
      CourtName: values
    })
  }

  updateCourtAddress(values) {
    this.update({
      CourtAddress: values
    })
  }

  updateDisposition(values) {
    this.update({
      Disposition: values
    })
  }

  updateAppeals(values) {
    this.update({
      Appeals: values
    })
  }

  render() {
    const prefix = this.props.prefix
    return (
      <div className="order">
        <Field
          title={i18n.t(`psychological.${prefix}.heading.occurred`)}
          help={`psychological.${prefix}.help.occurred`}
          adjustFor="labels"
          shrink={true}
          scrollIntoView={this.props.scrollIntoView}>
          <DateControl
            name="Occurred"
            {...this.props.Occurred}
            label={i18n.t(`psychological${prefix}.label.occurred`)}
            hideDay={true}
            onUpdate={this.updateOccurred}
            onError={this.props.onError}
            required={this.props.required}
          />
        </Field>

        <Field
          title={i18n.t(`psychological.${prefix}.heading.courtName`)}
          scrollIntoView={this.props.scrollIntoView}>
          <Text
            name="CourtName"
            className="courtname"
            {...this.props.CourtName}
            onUpdate={this.updateCourtName}
            onError={this.props.onError}
            required={this.props.required}
          />
        </Field>

        <Field
          title={i18n.t(`psychological.${prefix}.heading.courtAddress`)}
          optional={true}
          help={`psychological.${prefix}.help.courtAddress`}
          adjustFor="address"
          scrollIntoView={this.props.scrollIntoView}>
          <Location
            name="CourtAddress"
            {...this.props.CourtAddress}
            label={i18n.t(`psychological.${prefix}.label.courtAddress`)}
            layout={Location.ADDRESS}
            geocode={true}
            addressBooks={this.props.addressBooks}
            addressBook="Court"
            showPostOffice={true}
            dispatch={this.props.dispatch}
            onUpdate={this.updateCourtAddress}
            onError={this.props.onError}
            required={this.props.required}
          />
        </Field>

        <Show when={prefix !== 'competence'}>
          <Field
            title={i18n.t(`psychological.${prefix}.heading.disposition`)}
            help={`psychological.consultation.help.disposition`}
            scrollIntoView={this.props.scrollIntoView}>
            <Text
              name="Disposition"
              className="disposition"
              {...this.props.Disposition}
              onUpdate={this.updateDisposition}
              onError={this.props.onError}
              required={this.props.required}
            />
          </Field>
        </Show>

        <BranchCollection
          className="appeals"
          {...this.props.Appeals}
          label={i18n.t(`psychological.${prefix}.heading.appealed`)}
          appendLabel={i18n.t(
            `psychological.${prefix}.heading.appealedAnother`
          )}
          onError={this.props.onError}
          required={this.props.required}
          onUpdate={this.updateAppeals}
          scrollIntoView={this.props.scrollIntoView}>
          <AppealItem
            name="Item"
            bind={true}
            prefix={this.props.prefix}
            addressBooks={this.props.addressBooks}
            dispatch={this.props.dispatch}
            onError={this.props.onError}
            required={this.props.required}
            scrollIntoView={this.props.scrollIntoView}
          />
        </BranchCollection>
      </div>
    )
  }
}

Order.defaultProps = {
  List: [],
  prefix: 'order',
  addressBooks: {},
  dispatch: action => {},
  onUpdate: queue => {},
  onError: (value, arr) => {
    return arr
  }
}
