describe("History page (/historikk)", () => {
  beforeEach(() => {
    cy.visit("/historikk");
  });

  it("displays the page header", () => {
    cy.contains("Ordre historikk").should("be.visible");
    cy.contains(
      "Filtrer på dato, status eller skole i feltene under. Du kan også sortere ved å klikke på overskriftene."
    ).should("be.visible");
  });

  it("displays claim history from mock data", () => {
    cy.contains("1001").should("be.visible");
  });

  it("displays filters", () => {
    cy.contains("Ordre historikk").should("be.visible");
  });
});
