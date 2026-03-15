describe('Order Management Flow', () => {

  beforeEach(() => {

    cy.login();

    cy.intercept('POST', '**/private/api/v1/order/search', {
      statusCode: 200,
      body: {
        content: [
          {
            id: '1',
            order_name: 'ORD-0001',
            order_date: new Date().toISOString(),
            customer_name: 'Nguyễn Văn A',
            order_origin: 'Web',
            price: 500000,
            payment_state: 'PAID',
            process_state: 'NEW'
          }
        ],
        page_number: 0,
        page_size: 10,
        total_elements: 1,
        total_pages: 1
      }
    }).as('getOrders');

    cy.visit('/orders');

    cy.wait('@getOrders');
  });


  it('should display the order list correctly', () => {

    cy.get('h1')
      .contains('Quản lý đơn hàng')
      .should('be.visible');

    cy.get('tbody tr')
      .should('have.length', 1);

    cy.contains('ORD-0001').should('be.visible');
    cy.contains('Nguyễn Văn A').should('be.visible');

  });


  it('should navigate to create order page', () => {

    cy.contains('Thêm đơn hàng').click();

    cy.url().should('include', '/orders/create');

  });

});