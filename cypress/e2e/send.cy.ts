describe("Send page (/send)", () => {
  beforeEach(() => {
    cy.visit("/send");
  });

  it("displays the page header", () => {
    cy.contains("Ordre som ikke er sendt til fakturering").should(
      "be.visible"
    );
    cy.contains(
      "Søk på ordrenummer i feltet under. Oversikten viser kun ordrer du har opprettet."
    ).should("be.visible");
  });

  it("displays search field and send button", () => {
    cy.get('input[placeholder="Søk etter ordrenummer"]').should("be.visible");
    cy.contains("SEND ORDRE TIL FAKTURERING").should("be.visible");
  });

  it("displays pending claims from mock data", () => {
    cy.contains("2001").should("be.visible");
  });

  it("send button is disabled when no orders selected", () => {
    cy.contains("button", "SEND ORDRE TIL FAKTURERING").should(
      "be.disabled"
    );
  });
});
