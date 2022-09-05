describe('@atlaskit/drag-and-drop', () => {
  it('should allow drag and drop', () => {
    cy.visit('/scenario/atlaskit-drag-and-drop');

    // waiting for our first draggable to be visible
    cy.get('[data-testid="item-A0"]').should('be.visible').trigger('dragstart');

    cy.get('[data-testid="item-B0"]').trigger('drop');
  });
});
