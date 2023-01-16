Cypress.Commands.add('apiIntercept', (beforeAdd: boolean) => {
    cy.viewport(1000, 1200);
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/claim/?periodSelection=WEEK',
    }, {statusCode: 200, fixture: 'claims.json'});

    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/me',
    }, {fixture: 'me.json'});
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

    // cy.intercept({
    //     method: 'GET',
    //     url: 'http://localhost:3000/api/claim/count/by-status/ERROR,SEND_ERROR,ACCEPT_ERROR,UPDATE_ERROR',
    // }, {statusCode: 200, fixture: 'by-status.json'});

    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/claim/count/by-status/ERROR,SEND_ERROR,ACCEPT_ERROR,UPDATE_ERROR?days=14',
    }, {statusCode: 200, fixture: 'by-status.json'});

    if (beforeAdd) {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/api/claim/',
        }, {statusCode: 200, fixture: 'claims.json'});
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/api/claim/count/by-status/STORED?',
        }, {statusCode: 200, fixture: 'by-status.json'});
    } else {
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/api/claim/?status=STORED',
        }, {statusCode: 200, fixture: 'claims.json'});
        cy.intercept({
            method: 'GET',
            url: 'http://localhost:3000/api/claim/count/by-status/STORED?',
        }, {statusCode: 200, fixture: 'by-status.json'});
    }

});

Cypress.Commands.add('goToHome', () => {
    cy.visit('http://localhost:3000');
});

Cypress.Commands.add('changeSelection', () => {
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/claim/?periodSelection=MONTH&schoolSelection=974544520',
    }, {statusCode: 200, fixture: 'claims-with-new-claim.json'});
});

Cypress.Commands.add('changeDate', () => {
    cy.intercept({
        method: 'GET',
        url: 'http://localhost:3000/api/claim/?periodSelection=MONTH',
    }, {statusCode: 200, fixture: ('claims-with-new-claim.json')});
});

