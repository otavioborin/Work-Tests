import { defineConfig } from 'cypress'

const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = Math.floor(Math.random() * 5) + 5 // Random length between 5-10
  let result = ''

  // Generate first part
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  // Add space
  result += ' '

  // Generate second part
  for(let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return result
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // keep this as the dashboard url, as we need to authenticate and check the sales after the payment
      config.baseUrl = 'https://dashboard-dev-kiwify.netlify.app'
      config.env.buyerName = generateRandomString()
      config.env.buyerEmail = `${config.env.buyerName.split(' ')[0]}@test.com`
      config.env.paymentUrl = process.env.PAYMENT_URL || 'https://pay-dev.kiwify.com.br'
      config.env.externalId = 'BZBWtCLpw3YlbzLyRfVwUtbaIzM2' // ✅ Chave "externalId"
      config.env.deviceToken = 'zKQNrFELWXic6QuBrfsrOwmW4vMEHsFls5UgWKorQvsmhAOdzCbokCKYziNd7aG4TYJUeC18GV7CVbsmvAmQRyvxDxVlkSrdC2ve'

      // Definição das variáveis de ambiente para login
      config.env.email = 'product.testing@kiwify.com.br'
      config.env.password = '91939123Oab!'

      return config
    },
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    retries: 2,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})
