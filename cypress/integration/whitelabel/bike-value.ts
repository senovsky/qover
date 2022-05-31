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


describe('bike value input validation - happy paths', () => {
  it('accepts valid bike value at lower bound', () => {
    cy.get('[data-test="bike.quote.originalValue"]').type(String(validLowerBound))
    cy.get('[data-test="bike.quote.priceInfoButton"]').click()
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should('be.enabled')
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should('be.enabled')
  })

  it('accepts valid bike value at higher bound', () => {
    cy.get('[data-test="bike.quote.originalValue"]').type(String(validHigherBound))
    cy.get('[data-test="bike.quote.priceInfoButton"]').click()
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should('be.enabled')
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should('be.enabled')
  })
})

describe('bike value input validation - unhappy paths', () => {
  it('does not accept invalid bike value at lower bound', () => {
    cy.get('[data-test="bike.quote.originalValue"]').type(String(invalidLowerBound))
    cy.get('[data-test="bike.quote.priceInfoButton"]').click()
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should('not.exist')
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should('not.exist')
    cy.get('[data-test="error.minValue"]').should('contain.text', 'Min. €250')
  })

  it('does not accept invalid bike value at higher bound', () => {
    cy.get('[data-test="bike.quote.originalValue"]').type(String(invalidHigherBound))
    cy.get('[data-test="bike.quote.priceInfoButton"]').click()
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should('not.exist')
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should('not.exist')
    cy.get('[data-test="error.maxValue"]').should('contain.text', 'Max. €10.000')
  })

  it('does not accept invalid characters as bike value', () => {
    cy.get('[data-test="bike.quote.originalValue"]').type(invalidCharacters)
    cy.get('[data-test="bike.quote.priceInfoButton"]').click()
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_ASSISTANCE"]').should('not.exist')
    cy.get('[data-test="bike.quote.card.VARIANT_THEFT_DAMAGE_ASSISTANCE"]').should('not.exist')
    cy.get('[data-test="error.required"]').should('contain.text', 'Required')
  })
})

