import React from 'react'
import { MemoryRouter } from 'react-router'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { mount } from 'enzyme'
import SubstanceUse from './SubstanceUse'

const applicationState = {
  SubstanceUse: {}
}

describe('The substance use section', () => {
  // Setup
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  it('hidden when not authenticated', () => {
    window.token = ''
    const store = mockStore({
      authentication: [],
      application: applicationState
    })
    const component = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SubstanceUse />
        </MemoryRouter>
      </Provider>
    )
    expect(component.find('div').length).toEqual(0)
  })

  it('visible when authenticated', () => {
    window.token = 'fake-token'
    const store = mockStore({
      authentication: { authenticated: true, application: applicationState }
    })
    const component = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SubstanceUse />
        </MemoryRouter>
      </Provider>
    )
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  it('can review all subsections', () => {
    window.token = 'fake-token'
    const store = mockStore({ authentication: { authenticated: true } })
    const component = mount(
      <Provider store={store}>
        <MemoryRouter>
          <SubstanceUse subsection="review" />
        </MemoryRouter>
      </Provider>
    )
    expect(component.find('div').length).toBeGreaterThan(0)
  })

  it('can go to each subsection', () => {
    window.token = 'fake-token'
    const sections = [
      'drugs/usage',
      'drugs/purchase',
      'drugs/clearance',
      'drugs/misuse',
      'drugs/ordered',
      'drugs/voluntary',
      'alcohol/negative',
      'alcohol/voluntary',
      'alcohol/ordered'
    ]
    const store = mockStore({ authentication: { authenticated: true } })

    sections.forEach(section => {
      const component = mount(
        <Provider store={store}>
          <MemoryRouter>
            <SubstanceUse subsection={section} />
          </MemoryRouter>
        </Provider>
      )
      component.find('.no input').simulate('change')
      expect(component.find('div').length).toBeGreaterThan(0)
    })
  })
})
