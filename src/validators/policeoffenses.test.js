import PoliceOffensesValidator from './policeoffenses'

describe('Police record validation', function () {
  it('validates offenses', () => {
    const tests = [
      {
        state: {
          HasOffenses: 'No',
          List: [],
          ListBranch: 'No'
        },
        expected: true
      },
      {
        state: {
          HasOffenses: 'Yes',
          ListBranch: 'No',
          List: [
            {
              Item: {
                Date: {
                  day: '1',
                  month: '1',
                  year: '2016',
                  date: new Date('1/1/2016')
                },
                Description: {
                  value: 'Some description'
                },
                InvolvedViolence: 'No',
                InvolvedFirearms: 'No',
                InvolvedSubstances: 'No',
                Address: {
                  addressType: 'United States',
                  address: '1234 Some Rd',
                  city: 'Arlington',
                  state: 'Virginia',
                  zipcode: '22202'
                },
                WasCited: 'Yes',
                CitedBy: {
                  value: 'Somebody'
                },
                WasCharged: 'No',
                Explanation: {
                  value: 'Some explanation'
                },
                AgencyAddress: {
                  addressType: 'United States',
                  address: '1234 Some Rd',
                  city: 'Arlington',
                  state: 'Virginia',
                  zipcode: '22202'
                },

                WasSentenced: 'No',
                AwaitingTrial: 'Yes',
                AwaitingTrialExplanation: {
                  value: 'Yessss'
                }
              }
            }
          ]
        },
        expected: true
      },
      {
        state: {
          HasOffenses: 'Yes',
          List: [{Item: {}}]
        },
        expected: false
      },
      {
        state: {
          HasOffenses: 'Yes',
          List: []
        },
        expected: false
      },
      {
        state: {
          HasOffenses: 'Yes',
          ListBranch: 'No',
          List: [{Item: {}}]
        },
        expected: false
      },
      {
        state: {
          HasOffenses: 'No'
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new PoliceOffensesValidator(test.state, null).isValid()).toBe(test.expected)
    })
  })
})
