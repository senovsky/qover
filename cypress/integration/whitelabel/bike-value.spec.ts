beforeEach(() => {
  cy.visit('/bike/quote?key=pk_9153C6B0DDB3C97367AE&locale=en-BE')

  // the cookie banner can disrupt the execution of the tests by covering the viewport
  // since it's in a dynamically loaded iframe, it's difficult to click on the "Accept all" button
  // so the hacky solution is to set the style attribute of the banner and the dark overlay to 'display: none'
  cy.get('#main-cookie-banner', { timeout: 10000 }).should('be.visible')
  cy.get('.sp-overlay').invoke('attr', 'style', 'display: none')
  cy.get('#main-cookie-banner').invoke('attr', 'style', 'display: none')

  // we need to select a bike type before every test case
  // let's select the first one by index, not by value, because the values can change
  // even better approach would be to select the first non-empty value,
  // because now the following line will fail if the number of options is reduced to one
  cy.get('[data-test="bike.quote.type"]').select(1)
})

// in total, there's 975001 valid input values, but it would take a lot of time to test all of them
// so boundary value analysis was used to identify the necessary test values
// they are abstracted into variables so the test can be expanded later to account for different locales
// then the values of the variables can be loaded from a JSON for example
const validLowerBound = 250.00
const validHigherBound = 10000.00
const invalidLowerBound = 249.99
const invalidHigherBound = 10000.01
const invalidCharacters = '-a☺ .€' // https://vangogh.teespring.com/og_pic/116630915/9089087/front.jpg
const errorMessageMinValue = 'Min. €250'
const errorMessageMaxValue = 'Max. €10.000'
const errorMessageEmptyValue = 'Required'

// it's better to have this function here in this file - you don't have to scour several files during troubleshooting
// the function inputs the Insured value, clicks the See prices button and checks the state of the Choose this plan buttons
// the number of plans differs across countries, an improvement would be to find all selectors [data-test="bike.quote.card.*"]
function bikeValueInputValidation(bikeValue: string, quoteButtonsState: string) {
  cy.get('[data-test="bike.quote.originalValue"]').type(bikeValue)
  cy.get('[data-test="bike.quote.priceInfoButton"]').click()
  cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should(quoteButtonsState)
  cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should(quoteButtonsState)
} 

// all tests are self-contained, so they can be run individually by using it.only or describe.only
describe('bike value input validation - happy paths', () => {
  it('accepts valid bike value at lower bound', () => {
    bikeValueInputValidation(String(validLowerBound), 'be.enabled')
  })

  it('accepts valid bike value at higher bound', () => {
    bikeValueInputValidation(String(validHigherBound), 'be.enabled')
  })
})

// since there are self-descriptive data-test selectors available, there's no need for abstraction into page objects
// that would only make the troubleshooting of the tests more difficult, they are already legible well enough
describe('bike value input validation - unhappy paths', () => {
  // this test is going to fail so that there is at least one video and one screenshot when using `cypress run`
  it('does not accept invalid bike value at lower bound', () => {
    bikeValueInputValidation(String(invalidLowerBound), 'not.exist')
    cy.get('[data-test="error.minValue"]').should('contain.text', errorMessageMinValue).should('be.visible')
  })

  it('does not accept invalid bike value at higher bound', () => {
    bikeValueInputValidation(String(invalidHigherBound), 'not.exist')
    cy.get('[data-test="error.maxValue"]').should('contain.text', errorMessageMaxValue).should('be.visible')
  })

  it('does not accept invalid characters as bike value', () => {
    bikeValueInputValidation(invalidCharacters, 'not.exist')
    cy.get('[data-test="error.required"]').should('contain.text', errorMessageEmptyValue).should('be.visible')
    cy.get('[data-test="bike.quote.originalValue"]').should('be.empty')
  })
})

