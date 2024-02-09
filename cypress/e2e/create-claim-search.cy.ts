describe('Create a new claim', () => {
    it('Click create claim from main menu works', () => {
        cy.apiIntercept(true);
        cy.goToHome();
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
        cy.url().should('include', '/betaling/ny');
    });

    // it('Placeholder on searchField is correct', () => {
    //     cy.get('legend').first().should("contain", "Søk på gruppenavn");
    // });

    // it('Search for groups works', () => {
    //     cy.get('#standard-name').type("1");
    //     cy.get("tbody")
    //         .children()
    //         .should(
    //             ($tr) => {
    //                 expect($tr).to.have.length(10)
    //             }
    //         )
    // });

    // it('Select one group', () => {
    //     cy.get(':nth-child(2) > .MuiTableRow-hover > :nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input')
    //         .click();
    // });
    //
    // it('Click forward', () => {
    //     cy.get('[data-testid="recipientGoToProductsButton"]')
    //         .click();
    // });
    //
    // it('Click back', () => {
    //     cy.apiIntercept(true);
    //     cy.get('.makeStyles-buttonBackward-49')
    //         .click();
    // });
    //
    // it('Next step', () => {
    //     cy.apiIntercept(true);
    //     cy.get('[data-testid="recipientGoToProductsButton"]')
    //         .click();
    // });


    //
    // it.skip('Remove one group', () => {
    //     cy.get(':nth-child(2) > .MuiTableRow-hover > :nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input')
    //         .click();
    // });
    //
    // it('Select one group and remove one user', () => {
    //     cy.get(':nth-child(2) > .MuiTableRow-hover > .makeStyles-tableCellArrow-25').click();
    //     cy.get('[data-testid="recipientList"]')
    //         .children()
    //         .should(
    //             ($li) => {
    //                 expect($li).to.have.length(3);
    //             }
    //         );
    //     cy.get(':nth-child(1) > .MuiTableCell-alignCenter > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
    //     cy.get('[data-testid="recipientList"]')
    //         .children()
    //         .should(
    //             ($li) => {
    //                 expect($li).to.have.length(2);
    //             }
    //         );
    // });
    //
    // it.skip('Remove all recipients with delete all button', () => {
    //     cy.get('.MuiBox-root > [data-testid="DeleteIcon"] > path').click();
    //     cy.get('[data-testid="DeleteForeverIcon"]').click();
    //     cy.get('[data-testid="recipientList"]')
    //         .children()
    //         .should(
    //             ($li) => {
    //                 expect($li).to.have.length(0);
    //             }
    //         )
    // });
    //
    // it('Test colapse function', () => {
    //     cy.get('.makeStyles-rowSelected-27 > .makeStyles-tableCellArrow-25').click();
    //     cy.get("tbody")
    //         .children()
    //         .should(
    //             ($tr) => {
    //                 expect($tr).to.have.length(6)
    //             }
    //         );
    // });
    //
    // it('Activate person search', () => {
    //     cy.get(':nth-child(2) > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
    //     cy.get('legend').first().should("contain", "Søk på etternavn, fornavn mellomnavn");
    // });
    //
    // it('Search for student', () => {
    //     cy.get('#standard-name').type("Test");
    //     cy.get("tbody")
    //         .children()
    //         .should(
    //             ($tr) => {
    //                 expect($tr).to.have.length(5)
    //             }
    //         )
    // });
    //
    // it('Select one student', () => {
    //     cy.get("tr")
    //         .next()
    //         .first()
    //         .find('input')
    //         .click();
    // });
});
