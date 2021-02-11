// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('apiIntercept', () => {
    cy.viewport(1000, 1000);
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/me',
    }, {fixture: 'me.json'});
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/claim',
    }, {statusCode: 200, fixture: 'claims.json'});
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/group/basis-group',
    }, {statusCode: 200, fixture: 'basis-groups.json'});
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/group/teaching-group',
    }, {statusCode: 200, fixture: 'teaching-groups.json'});
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/group/school',
    }, {statusCode: 200, fixture: 'schools.json'});
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/principal',
    }, {statusCode: 200, fixture: 'principals.json'});
    cy.intercept({
        method: 'POST',
        url: 'http://localhost:3000/api/claim/send',
    }, {statusCode: 201, fixture: 'sentClaim.json'});
});

Cypress.Commands.add('goToHome', () => {
        cy.visit('http://localhost:3000');
    }
);

Cypress.Commands.add('searchFor', (searchValue) => {
    cy.get('#searchTextField')
        .type(searchValue);
});

Cypress.Commands.add("getClaimWithNewClaim", () => {
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/claim',
    }, {fixture: 'claims-with-new-claim.json'});
});