import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import Name from './Name'

describe('The Name component', () => {
  // Setup
  const middlewares = [ thunk ]
  const mockStore = configureMockStore(middlewares)

  it('no error on empty', () => {
    const store = mockStore({ authentication: [] })
    const expected = {
      name: 'input-focus',
      label: 'Text input focused',
      value: ''
    }
    const component = mount(<Provider store={store}><Name name={expected.name} label={expected.label} value={expected.value} /></Provider>)
    component.find('input#last').simulate('change')
    expect(component.find('div.hidden').length).toBeGreaterThan(0)
  })

  it('handles last name patterns', () => {
    const store = mockStore({ authentication: [] })
    const expected = [
      {
        name: 'applicant-name',
        last: 'X- Mc. O\'Leary',
        valid: true
      },
      {
        name: 'applicant-numbers',
        last: 'abc 123',
        valid: false
      }
    ]

    expected.forEach((ex) => {
      const component = mount(<Provider store={store}><Name name={ex.name} last={ex.last} /></Provider>)
      component.find('input#last').simulate('change')
      expect(component.find('div.hidden').length).toBeGreaterThan(0)
    })
  })

  it('handles maximum lengths', () => {
    const store = mockStore({ authentication: [] })
    const expected = [
      {
        name: 'applicant-long-first',
        first: 'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffgggggggggghhhhhhhhhhiiiiiiiiiijjjjjjjjjjkkkkkkkkkk',
        part: 'first',
        valid: false
      },
      {
        name: 'applicant-long-last',
        last: 'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffgggggggggghhhhhhhhhhiiiiiiiiiijjjjjjjjjjkkkkkkkkkk',
        part: 'last',
        valid: false
      },
      {
        name: 'applicant-long-middle',
        middle: 'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffgggggggggghhhhhhhhhhiiiiiiiiiijjjjjjjjjjkkkkkkkkkk',
        part: 'middle',
        valid: false
      }
    ]

    expected.forEach((ex) => {
      const component = mount(<Provider store={store}><Name name={ex.name} first={ex.first} last={ex.last} middle={ex.middle} /></Provider>)
      component.find('input#' + ex.part).simulate('change')
      expect(component.find('.usa-input-error-label').length === component.find('span').length).toEqual(ex.valid)
    })
  })

  it('bubbles up validate event', () => {
    const store = mockStore({ authentication: [] })
    let validations = 0
    const expected = {
      name: 'input-error',
      label: 'Text input error',
      error: true,
      focus: false,
      valid: false,
      handleValidation: function (event) {
        validations++
      }
    }
    const component = mount(<Provider store={store}><Name name={expected.name} onValidate={expected.handleValidation} /></Provider>)
    component.find('input').first().simulate('change')
    expect(validations > 0).toEqual(true)
  })

  it('bubbles up change event', () => {
    const store = mockStore({ authentication: [] })
    let changes = 0
    const expected = {
      name: 'input-error',
      label: 'Text input error',
      error: true,
      focus: false,
      valid: false,
      handleChange: function (event) {
        changes++
      }
    }
    const component = mount(<Provider store={store}><Name name={expected.name} onChange={expected.handleChange} /></Provider>)
    component.find('input').first().simulate('change')
    expect(changes).toEqual(1)
  })

  it('bubbles up focus event', () => {
    const store = mockStore({ authentication: [] })
    let foci = 0
    const expected = {
      name: 'input-error',
      label: 'Text input error',
      error: true,
      focus: false,
      valid: false,
      handleFocus: function (event) {
        foci++
      }
    }
    const component = mount(<Provider store={store}><Name name={expected.name} onFocus={expected.handleFocus} /></Provider>)
    component.find('input').first().simulate('focus')
    expect(foci).toEqual(1)
  })

  it('bubbles up blur event', () => {
    const store = mockStore({ authentication: [] })
    let blurs = 0
    const expected = {
      name: 'input-error',
      label: 'Text input error',
      error: true,
      focus: false,
      valid: false,
      handleBlur: function (event) {
        blurs++
      }
    }
    const component = mount(<Provider store={store}><Name name={expected.name} onBlur={expected.handleBlur} /></Provider>)
    component.find('input').first().simulate('blur')
    expect(blurs).toEqual(1)
  })
})
