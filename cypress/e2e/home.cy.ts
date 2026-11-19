describe("Home page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("displays the dashboard with organisation name", () => {
    cy.contains("Dashboard - Test School").should("be.visible");
  });

  it("displays the page description", () => {
    cy.contains("Oversikt over ordrer og aktivitet").should("be.visible");
  });

  it("displays dashboard stats", () => {
    cy.contains("Betalte ordrer siste 12 måneder")
      .closest(".novari-stats-link-card")
      .find("h2")
      .invoke("text")
      .should("match", /^\d+$/);
    cy.contains("Ventende ordrer").should("be.visible");
    cy.contains("Antall feil").should("be.visible");

    cy.contains("5").should("be.visible"); // pending
    cy.contains("2").should("be.visible"); // errors
  });

  it("displays batch history section", () => {
    cy.contains("Batch historikk").should("be.visible");
  });

  it("displays the header with app name", () => {
    cy.get("[data-cy=novari-header]").should("be.visible");
    cy.contains("FINT Elevfakturering").should("be.visible");
  });
});
