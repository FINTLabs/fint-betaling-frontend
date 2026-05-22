describe("New claim page (/ny)", () => {
  beforeEach(() => {
    cy.visit("/ny");
  });

  it("displays the stepper with three steps", () => {
    cy.contains("Velg mottaker").should("be.visible");
    cy.contains("Velg produkt").should("be.visible");
    cy.contains("Lagre").should("be.visible");
  });

  it("displays recipient selection step by default", () => {
    cy.contains("Velg mottaker").should("be.visible");
  });

  it("displays group recipients from mock data", () => {
    cy.contains("1A").should("be.visible");
    cy.contains("Math 101").should("be.visible");
  });

  it.skip("displays products when navigating to product step", () => {
    cy.get('#checkbox-_R_1rdmub5_').check();
    cy.contains("button", "Videre til produktvalg")
      .should("not.be.disabled")
    cy.contains("Test product").should("be.visible");
  });
});
