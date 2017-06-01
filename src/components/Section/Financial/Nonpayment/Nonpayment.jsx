import React from 'react'
import { i18n } from '../../../../config'
import { NonpaymentValidator } from '../../../../validators'
import SubsectionElement from '../../SubsectionElement'
import { Branch, Show, Accordion, DateControl, Currency, Field,
         NotApplicable, Checkbox, Text, Textarea } from '../../../Form'
import Infractions from './Infractions'

export default class Nonpayment extends SubsectionElement {
  constructor (props) {
    super(props)

    this.state = {
      HasNonpayment: props.HasNonpayment,
      List: props.List,
      ListBranch: props.ListBranch
    }

    this.updateBranch = this.updateBranch.bind(this)
    this.updateList = this.updateList.bind(this)
    this.summary = this.summary.bind(this)
  }

  /**
   * Updates triggered by the branching component.
   */
  updateBranch (val, event) {
    this.setState({ HasNonpayment: val }, () => {
      this.updateList({
        items: val === 'No' ? [] : this.state.List,
        branch: ''
      })
    })
  }

  /**
   * Dispatch callback initiated from the collection to notify of any new
   * updates to the items.
   */
  updateList (values) {
    this.setState({ List: values.items, ListBranch: values.branch }, () => {
      if (this.props.onUpdate) {
        this.props.onUpdate({
          List: this.state.List,
          ListBranch: this.state.ListBranch,
          HasNonpayment: this.state.HasNonpayment
        })
      }
    })
  }

  /**
   * Assists in rendering the summary section.
   */
  summary (item, index) {
    const obj = (item || {})
    const name = (obj.Name || {}).value || i18n.t('financial.nonpayment.collection.summary.unknown')
    const amount = (obj.Amount || {}).value
    const text = `${name}${amount ? ', $' + amount : ''}`.trim()
    const date = (obj.Date || {})

    let from = ''
    if (date.month && date.year) {
      from = '' + date.month + '/' + date.year
    }

    return (
      <span>
        <span className="index">{i18n.t('financial.nonpayment.collection.summary.item')} {index + 1}:</span>
        <span><strong>{text}</strong></span>
        <span className="dates"><strong>{from}</strong></span>
      </span>
    )
  }

  message () {
    return (
      <div>
        <ul>
          <li>{i18n.m('financial.nonpayment.para.repo')}</li>
          <li>{i18n.m('financial.nonpayment.para.defaulted')}</li>
          <li>{i18n.m('financial.nonpayment.para.collections')}</li>
          <li>{i18n.m('financial.nonpayment.para.cancelled')}</li>
          <li>{i18n.m('financial.nonpayment.para.evicted')}</li>
          <li>{i18n.m('financial.nonpayment.para.garnished')}</li>
          <li>{i18n.m('financial.nonpayment.para.delinquent')}</li>
          <li>{i18n.m('financial.nonpayment.para.any')}</li>
        </ul>
      </div>
    )
  }

  render () {
    return (
      <div className="nonpayment">
        <Branch name="has_nonpayment"
                className="nonpayment-branch"
                value={this.state.HasNonpayment}
                onUpdate={this.updateBranch}
                onError={this.handleError}>
        </Branch>
        <Show when={this.state.HasNonpayment === 'Yes'}>
          <Accordion minimum="1"
                     items={this.state.List}
                     branch={this.state.ListBranch}
                     onUpdate={this.updateList}
                     onError={this.handleError}
                     summary={this.summary}
                     description={i18n.t('financial.nonpayment.collection.summary.title')}
                     appendTitle={i18n.t('financial.nonpayment.collection.appendTitle')}
                     appendMessage={this.message()}
                     appendLabel={i18n.t('financial.nonpayment.collection.append')}>

            <Field title={i18n.t('financial.nonpayment.heading.name')}>
              <Text name="Name"
                    className="nonpayment-name"
                    bind={true}
                    />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.infractions')}>
              <Infractions name="Infractions"
                           className="nonpayment-infractions"
                           bind={true}
                           />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.accountnumber')}>
              <Text name="AccountNumber"
                    className="nonpayment-accountnumber"
                    bind={true}
                    />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.propertytype')}>
              <Text name="PropertyType"
                    className="nonpayment-propertytype"
                    bind={true}
                    />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.amount')}>
              <div>
                <Currency name="Amount"
                          className="nonpayment-amount"
                          placeholder={i18n.t('financial.nonpayment.placeholder.amount')}
                          min="1"
                          bind={true}
                          />
                <div className="flags">
                  <Checkbox name="AmountEstimated"
                            ref="estimated"
                            label={i18n.t('financial.nonpayment.label.estimated')}
                            toggle="false"
                            bind={true}
                            />
                </div>
              </div>
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.reason')}
                   help="financial.nonpayment.help.reason">
              <Textarea name="Reason"
                        className="nonpayment-reason"
                        bind={true}
                        />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.status')}>
              <Text name="Status"
                    className="nonpayment-status"
                    bind={true}
                    />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.resolved')}
                   adjustFor="address"
                   shrink={true}>
              <NotApplicable name="ResolvedNotApplicable"
                             label={i18n.t('financial.nonpayment.label.notresolved')}
                             or={i18n.m('financial.nonpayment.para.or')}
                             bind={true}>
                <DateControl name="Resolved"
                             className="nonpayment-resolved"
                             hideDay={true}
                             bind={true}
                             />
              </NotApplicable>
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.date')}
                   adjustFor="labels"
                   shrink={true}>
              <DateControl name="Date"
                           className="nonpayment-date"
                           hideDay={true}
                           bind={true}
                           />
            </Field>

            <Field title={i18n.t('financial.nonpayment.heading.description')}
                   help="financial.nonpayment.help.description">
              <Textarea name="Description"
                        className="nonpayment-description"
                        bind={true}
                        />
            </Field>

          </Accordion>
        </Show>
      </div>
    )
  }
}

Nonpayment.defaultProps = {
  HasNonpayment: '',
  List: [],
  ListBranch: '',
  onError: (value, arr) => { return arr },
  section: 'financial',
  subsection: 'nonpayment',
  dispatch: () => {},
  validator: (state, props) => {
    return new NonpaymentValidator(state, props).isValid()
  }
}
