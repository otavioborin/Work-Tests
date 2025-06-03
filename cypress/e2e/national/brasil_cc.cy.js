describe('Custom Checkout', () => {
  const buyerName = Cypress.env('buyerName')
  const buyerEmail = Cypress.env('buyerEmail')

  it('performs payment', () => {
    const localUrl = Cypress.env('paymentUrl')
    cy.visit(`${localUrl}/bqPBIVx`)

    cy.get('input[name="fullname"]').type(buyerName)
    cy.get('input[kiwi-data="email"').type(buyerEmail)
    cy.get('input[kiwi-data="confirmEmail"').type(buyerEmail)
    cy.get('input[name="document"]').type('12312312387')
    cy.get('input[kiwi-data="phone"').type('11987654321')
    cy.get('input[kiwi-data="ccnumber"').type('4235647728025682', { force: true })
    cy.get('select[name="ccmonth_1"]').select('01', { force: true })
    cy.get('select[name="ccyear_1"]').select('2035', { force: true })
    cy.get('select[name="tel"]').select('12', { force: true })
    cy.get('input[kiwi-data="cccv"').type('123', { force: true })
    cy.get('#saveDetails').click()
    cy.get('a[kiwi-data="pay_button"]').click()
    cy.contains('foi aprovada!', { timeout: 60000 }).should('be.visible')
  })

  it('log in', () => {
    cy.visit('https://dashboard-dev-kiwify.netlify.app/')
    cy.ensureAuthenticated()
    cy.intercept('GET', 'https://admin-api-dev.kiwify.com.br/v2/orders/*').as('getOrder')
    cy.get('a[href="/sales"').click({ multiple: true, force: true})
    cy.get('.flex-grow > .form-input').type(buyerName)
    cy.get('.text-sm').contains(buyerName).parents('td').find('a').click()
    cy.wait('@getOrder', { timeout: 10000 }).then((interception) => {
      if (!interception.response || !interception.response.body) {
        throw new Error("❌ Nenhuma resposta da API foi capturada!")
      }
      console.log("🚀 Resposta da API:", interception.response.body)
      const orderId = interception.response.body.order_id 
      if (!orderId) {
        throw new Error("❌ order_id não encontrado na resposta da API")
      }
      cy.log(`✅ Order ID capturado: ${orderId}`)
      cy.wrap(orderId).as('orderId')
      Cypress.env('order_id', orderId)
    })

    cy.contains('Valores').click()
    cy.contains('Preço base do produto').parents('.grid').contains('R$ 189,99').then(() => cy.log('✅ 200 OK'));
    cy.contains('Preço com acréscimo').parents('.grid').contains('R$ 235,79').then(() => cy.log('✅ 200 OK'));
    cy.contains('Taxas').parents('.grid').contains('R$ 19,57').then(() => cy.log('✅ 200 OK'));
    cy.contains('R$ 170,42').then(() => cy.log('✅ 200 OK'));
    
  })
})
