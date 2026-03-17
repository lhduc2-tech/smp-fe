describe('Product Management Flow', () => {

  beforeEach(() => {

    cy.intercept('GET', '**/private/api/v1/products/all-by-shop/*', {
      statusCode: 200,
      body: [
        {
          id: '1',
          code: 'SP001',
          name: 'Sản phẩm Test 1',
          price: 150000,
          shop_id: '1',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          code: 'SP002',
          name: 'Sản phẩm Test 2',
          price: 200000,
          shop_id: '1',
          created_at: new Date().toISOString()
        }
      ]
    }).as('getProducts');

    cy.visit('/products', {
      onBeforeLoad(win) {

        const fakeToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJzdWIiOiJhZG1pbiIsInVzZXJJZCI6IjEiLCJzaG9wSWQiOiIxIiwiZXhwIjo0MTAyNDQ0ODAwfQ.' +
          '.signature';

        win.localStorage.setItem('access_token', fakeToken);
        win.localStorage.setItem('username', 'admin');
        win.localStorage.setItem('user_id', '1');
        win.localStorage.setItem('shop_id', '1');  // QUAN TRỌNG

      }
    });

    cy.wait('@getProducts');

  });

  it('should display product list', () => {

    cy.contains('Quản lý sản phẩm').should('be.visible');

    cy.get('tbody tr')
      .should('have.length', 2);

    cy.contains('SP001');
    cy.contains('SP002');

  });


  it('should filter product by search', () => {

    cy.get('input[placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."]')
      .type('Test 1{enter}');

    cy.get('tbody tr')
      .should('have.length', 1);

    cy.contains('SP001').should('be.visible');
    cy.contains('Sản phẩm Test 1').should('be.visible');

  });


  it('should navigate to add product page', () => {

    cy.contains('Thêm sản phẩm').click();

    cy.url().should('include', '/products/add');

  });

});