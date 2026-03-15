export {};
declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', () => {

  const fakeToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
    'eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJzaG9wSWQiOiIxIiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlcyI6WyJBRE1JTiJdLCJwZXJtaXNzaW9ucyI6WyJBRE1JTiJdfQ.' +
    '.signature';

  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('access_token', fakeToken);
       win.localStorage.setItem('shop_id', '1');
       win.localStorage.setItem('shop_id', '1');
      win.localStorage.setItem('username', 'admin');
    }
  });

});