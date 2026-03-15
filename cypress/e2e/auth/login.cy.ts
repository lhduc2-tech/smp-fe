describe('Auth - Login Flow', () => {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login form correctly', () => {

    cy.get('h1.title')
      .should('be.visible')
      .and('contain', 'CHÀO MỪNG QUAY TRỞ LẠI');

    cy.get('#username')
      .should('exist')
      .and('have.attr', 'type', 'text');

    cy.get('#password')
      .should('exist')
      .and('have.attr', 'type', 'password');

    cy.get('button.btn-signin')
      .should('exist')
      .and('contain', 'Đăng nhập');
  });


  it('should mark fields invalid when submitting empty form', () => {

    cy.get('button.btn-signin').click();

    cy.get('#username').should('have.class', 'ng-invalid');
    cy.get('#password').should('have.class', 'ng-invalid');

    cy.url().should('include', '/login');
  });


  it('should login successfully and redirect to dashboard', () => {

    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJzaG9wSWQiOiIxIiwiZXhwIjo0MTAyNDQ0ODAwLCJyb2xlcyI6WyJBRE1JTiJdLCJwZXJtaXNzaW9ucyI6WyJBRE1JTiJdfQ.' +
      '.signature';

    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        access_token: fakeToken
      }
    }).as('loginSuccess');

    cy.get('#username').type('admin');
    cy.get('#password').type('password123');

    cy.get('button.btn-signin').click();

    cy.wait('@loginSuccess');

    cy.url().should('include', '/dashboard');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('access_token')).to.exist;
    });

  });

});