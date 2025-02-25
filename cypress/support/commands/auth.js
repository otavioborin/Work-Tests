Cypress.Commands.add('setupDeviceToken', () => {
  const externalId = Cypress.env('externalId') // ✅
  const deviceToken = Cypress.env('deviceToken') // ✅
  window.localStorage.setItem(`kiwi_device_token_${externalId}`, deviceToken)
})

Cypress.Commands.add('ensureAuthenticated', () => {
  // Configura o token ANTES de limpar o storage (se necessário)
  cy.setupDeviceToken() // ✅ Primeiro configuramos o token
  
  // Limpa os storages (avaliar se realmente necessário)
  cy.clearAllCookies().clearAllLocalStorage().clearAllSessionStorage()
  
  // Reaplica o token após limpeza (caso a limpeza seja necessária)
  cy.setupDeviceToken() // ✅ Garantir que o token persista
  
  cy.visit('https://dashboard-dev-kiwify.netlify.app/login')
  cy.reload()

  // Check if we're on the login page by looking at the url
  cy.document().then((_$document) => {
    let attempts = 0;
    const maxAttempts = 10;

    const checkHomeOrLogin = () => {
      cy.get('body').then($body => {
        if ($body.text().includes('Members Area')) {
          // Dashboard found, proceed
          return;
        }

        cy.url().then((url) => {
          if (url.includes('/login')) {
            // On login page, authenticate
            cy.get('input[id="email"]', { timeout: 10000 }).type(Cypress.env('email'))
            cy.get('input[id="password"]', { timeout: 10000 }).type(Cypress.env('password'))
            
            cy.get('button').click()

            cy.url().should('not.include', '/login')
          } else {
            // Not on login and Dashboard not found
            attempts++;
            if (attempts < maxAttempts) {
              cy.wait(1000);
              checkHomeOrLogin();
            } else {
              throw new Error('Dashboard not found after maximum attempts');
            }
          }
        });
      });
    };

    checkHomeOrLogin();
  })
})