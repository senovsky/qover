beforeEach(() => {
  cy.visit('/bike/quote?key=pk_9153C6B0DDB3C97367AE&locale=en-BE')
  cy.get('#main-cookie-banner', { timeout: 10000 }).should('be.visible')
  cy.get('.sp-overlay').invoke('attr', 'style', 'display: none')
  cy.get('#main-cookie-banner').invoke('attr', 'style', 'display: none')
  cy.get('[data-test="bike.quote.type"]').select('TYPE_REGULAR_BIKE')
})

const validLowerBound = 250.00
const validHigherBound = 10000.00
const invalidLowerBound = 249.99
const invalidHigherBound = 10000.01
const invalidCharacters = '-a☺ .€'

const errorMessageMinValue = 'Min. €250'
const errorMessageMaxValue = 'Max. €10.000'
const errorMessageEmptyValue = 'Required'

function bikeValueInputValidation(bikeValue: string, quoteButtonsState: string) {
  cy.get('[data-test="bike.quote.originalValue"]').type(bikeValue)
  cy.get('[data-test="bike.quote.priceInfoButton"]').click()
  cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should(quoteButtonsState)
  cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should(quoteButtonsState)
} 

describe('bike value input validation - happy paths', () => {
  it('accepts valid bike value at lower bound', () => {
    bikeValueInputValidation(String(validLowerBound), 'be.enabled')
  })

  it('accepts valid bike value at higher bound', () => {
    bikeValueInputValidation(String(validHigherBound), 'be.enabled')
  })
})

describe('bike value input validation - unhappy paths', () => {
  it('does not accept invalid bike value at lower bound', () => {
    bikeValueInputValidation(String(invalidLowerBound), 'not.exist')
    cy.get('[data-test="error.minValue"]').should('contain.text', errorMessageMinValue)
  })

  it('does not accept invalid bike value at higher bound', () => {
    bikeValueInputValidation(String(invalidHigherBound), 'not.exist')
    cy.get('[data-test="error.maxValue"]').should('contain.text', errorMessageMaxValue)
  })

  it('does not accept invalid characters as bike value', () => {
    bikeValueInputValidation(invalidCharacters, 'not.exist')
    cy.get('[data-test="error.required"]').should('contain.text', errorMessageEmptyValue)
    cy.get('[data-test="bike.quote.originalValue"]').should('be.empty')
  })
})

