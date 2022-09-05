describe('@atlaskit/drag-and-drop', () => {
  it('should allow drag and drop', () => {
    cy.visit('/scenario/atlaskit-drag-and-drop');

    // waiting for our board to be visible
    cy.get('[data-testid="item-A0"]').should('be.visible');

    // asserting initial sizes
    cy.get('[data-testid="column-A--card-list"]')
      .find('[draggable="true"]')
      .should('have.length', 16);
    cy.get('[data-testid="column-A--card-list"]')
      .find('[draggable="true"]')
      .should('have.length', 16);

    // Move A0 to column B
    cy.get('[data-testid="item-A0"]')
      .should('be.visible')
      .trigger('dragstart', { force: true, eventConstructor: 'DragEvent' });

    cy.get('[data-testid="item-B0"]')
      .trigger('dragenter', { force: true, eventConstructor: 'DragEvent' })
      .trigger('drop', { force: true, eventConstructor: 'DragEvent' });

    cy.get('[data-testid="column-A--card-list"]')
      .find('[draggable="true"]')
      .should('have.length', 15);

    cy.get('[data-testid="column-B--card-list"]')
      .find('[draggable="true"]')
      .should('have.length', 17);
  });
});

// appeasing TS
export {};
