import React from 'react'
import { mount } from 'enzyme'
import Unlawful from './Unlawful'

describe('The legal technology unlawful access component', () => {
  it('renders without errors', () => {
    const component = mount(<Unlawful />)
    expect(component.find('.legal-technology-unlawful').length).toBe(1)
  })

  it('can select "yes"', () => {
    let updates = 0
    const onUpdate = () => { updates++ }
    const component = mount(<Unlawful onUpdate={onUpdate} />)
    component.find('.legal-technology-unlawful-has-unlawful .yes input').simulate('change')
    expect(updates).toBe(1)
  })

  it('list displayed if "yes" is clicked', () => {
    const props = {
      HasUnlawful: 'Yes'
    }
    const component = mount(<Unlawful {...props} />)
    expect(component.find('.accordion').length).toBe(1)
  })

  it('renders summary', () => {
    const props = {
      HasUnlawful: 'Yes',
      List: [
        {
          Date: {
            date: new Date('1/1/2010')
          },
          Incident: {
            value: 'Looked over the shoulder'
          }
        }
      ],
      ListBranch: ''
    }
    const component = mount(<Unlawful {...props} />)
    const text = component.find('.accordion .summary .left .content').text()
    expect(text).toContain('Looked over the shoulder')
    expect(text).toContain('1/2010')
  })
})
