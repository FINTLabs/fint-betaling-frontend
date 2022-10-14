describe('Send claims', () => {

    it('Click create claim from main menu works', () => {
        cy.apiIntercept(false);
        cy.goToHome();
        cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
        cy.url().should('include', '/betaling/send');
    });

    it('List shows the 2 unsent claims', () => {
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    expect($tr).to.have.length(2)
                }
            )
    });

    it('Search for ordernumber works', () => {
        cy.get('#standard-name').type("102536");
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    expect($tr).to.have.length(2)
                }
            )
    });

    it('Delete order should not exist', () => {
        cy.get('[data-testid="delete-icon"]').should("not.exist");
    });

    it('Selecting the claim works', () => {
        cy.get("tr")
            .find('input')
            .last()
            .click();
    });

    it('Delete order should be enabled', () => {
        cy.get('[data-testid="delete-icon"]').should("exist");
    });

    it('Delete order confirm icon', () => {
        cy.get('[data-testid="DeleteIcon"]').click();
        cy.wait(500);
        cy.get('[data-testid="delete-icon"]').should("contain", "Bekreft");
        cy.wait(500);
    });

    // it('Delete order with cancelling', () => {
    //     cy.get('[data-testid="delete-icon"]').click();
    //     cy.get("#cancelDeleteOrderButton").click();
    //     cy.get("tbody")
    //         .children()
    //         .should(
    //             ($tr) => {
    //                 expect($tr).to.have.length(2)
    //             }
    //         )
    // });
    //
    // it('Delete order with confirming', () => {
    //     cy.apiIntercept();
    //     cy.get('[data-testid="DeleteIcon"]').click();
    //     cy.get("#confirmDeleteOrderButton").click();
    //     cy.get("tbody")
    //         .children()
    //         .should(
    //             ($tr) => {
    //                 expect($tr).to.have.length(1)
    //             }
    //         )
    // });

    it('Send order to mock backend', () => {
        cy.apiIntercept();
        // cy.get("#sendToInvoiceSearchField").clear();
        // cy.get("tr")
        //     .find('input')
        //     .last()
        //     .click();
        cy.get('.css-1l4w6pd > .MuiButtonBase-root').click();
    });

    it('Snackbar showing 1 order sent', () => {
        cy.get('.MuiSnackbar-root > .MuiPaper-root').contains("1 ordre er sendt til økonomisystemet!")
    });
})