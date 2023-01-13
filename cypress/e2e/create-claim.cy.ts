describe('Create a new claim', () => {
    it('Click create claim from main menu works', () => {
        cy.apiIntercept(true);
        cy.goToHome();
        cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
        cy.url().should('include', '/betaling/ny');
    });

    it('Placeholder on searchField is correct', () => {
        cy.get('legend').first().should("contain", "Søk på gruppenavn");
    });

    it('Search for groups works', () => {
        cy.get('#standard-name').type("1");
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    expect($tr).to.have.length(6)
                }
            )
    });

    it('Select one group', () => {
        cy.get(':nth-child(2) > .MuiTableRow-hover > :nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input')
            .click();
    });

    it.skip('Remove one group', () => {
        cy.get(':nth-child(2) > .MuiTableRow-hover > :nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input')
            .click();
    });

    it('Select one group and remove one user', () => {
        cy.get(':nth-child(2) > .MuiTableRow-hover > .makeStyles-tableCellArrow-25').click();
        cy.get('[data-testid="recipientList"]')
            .children()
            .should(
                ($li) => {
                    expect($li).to.have.length(3);
                }
            );
        cy.get(':nth-child(1) > .MuiTableCell-alignCenter > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('[data-testid="recipientList"]')
            .children()
            .should(
                ($li) => {
                    expect($li).to.have.length(2);
                }
            );
    });

    it.skip('Remove all recipients with delete all button', () => {
        cy.get('.MuiBox-root > [data-testid="DeleteIcon"] > path').click();
        cy.get('[data-testid="DeleteForeverIcon"]').click();
        cy.get('[data-testid="recipientList"]')
            .children()
            .should(
                ($li) => {
                    expect($li).to.have.length(0);
                }
            )
    });

    it('Test colapse function', () => {
        cy.get('.makeStyles-rowSelected-27 > .makeStyles-tableCellArrow-25').click();
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    expect($tr).to.have.length(6)
                }
            );
    });

    it('Activate person search', () => {
        cy.get(':nth-child(2) > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('legend').first().should("contain", "Søk på etternavn, fornavn mellomnavn");
    });

    it('Search for student', () => {
        cy.get('#standard-name').type("Test");
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    expect($tr).to.have.length(5)
                }
            )
    });

    it('Select one student', () => {
        cy.get("tr")
            .next()
            .first()
            .find('input')
            .click();
    });
});

describe('Testing selecting products', () => {
    it('"Videre"-button is active', () => {
        cy.apiIntercept();
        cy.get('[data-testid="recipientGoToProductsButton"]').should('not.be.disabled');
        cy.get('[data-testid="recipientGoToProductsButton"]').click();
    });

    it('Title is correct', () => {
        cy.get('[data-testid="pageTitle"]').should("contain", "Velg produkt");
    });

    it('Placeholder on searchField is correct', () => {
        cy.get('legend').first().should("contain", "Søk på produktnavn eller produktkode");
    });

    it('Search for products works', () => {
        cy.get("#standard-name").type("1");
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    expect($tr).to.have.length(2)
                }
            )
    });

    it('Select one product', () => {
        cy.get("tr")
            .next()
            .first()
            .find('input')
            .first()
            .click();
    });

    it('Remove the product', () => {
        cy.get("tr")
            .next()
            .first()
            .find('input')
            .first()
            .click();
    });

    it('Add the product for further testing', () => {
        cy.get("tr")
            .next()
            .first()
            .find('input')
            .first()
            .click();
    });

    it('Change price', () => {
        cy.get('#mui-5').clear().type("500");
        cy.get('#mui-6').clear().type("20");
    });

    it('Check that price is correct for row', () => {
        cy.get(':nth-child(2) > :nth-child(8)').should("contain", "500,20");
    });

    it('Change quantity', () => {
        cy.get(':nth-child(2) > :nth-child(7)').type("{selectAll}4");
    });

    it('Add text to free text field', () => {
        cy.get('#mui-4').type("test fritekst");
    });
});


describe('Testing summary page', () => {
    it('Click next button is active, and click it to enter summary', () => {
        cy.apiIntercept();
        cy.get('[data-testid="nextButtonToSummary"]').should('not.be.disabled');
        cy.get('[data-testid="nextButtonToSummary"]').click();
    });

    it('Check that summaryTitle is correct and visible', () => {
        cy.get('[data-testid="pageTitle"]').should("be.visible");
        cy.get('[data-testid="pageTitle"]').should("contain", "Lagre betaling");
    });

    it('Check that recipientNameCell is correct and visible', () => {
        cy.get('.makeStyles-tableWrapper-58 > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-root').should("be.visible");
        cy.get('.makeStyles-tableWrapper-58 > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-root').should("contain", "Testbruker, Nummer Fem");
    });

    it('Check that productDescriptionCell is correct and visible', () => {
        cy.get('.css-1gngpax > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > :nth-child(1)').should("be.visible");
        cy.get('.css-1gngpax > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root > :nth-child(1)').should("contain", "DIVERSE SALG MED MVA");
    });

    it('Check that productFreeTextCell is correct and visible', () => {
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(2)').should("be.visible");
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(2)').should("contain", "test fritekst");
    });

    it('Check that summaryTitle is correct and visible', () => {
        cy.get('.MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root').should("be.visible");
        cy.get('.MuiTableBody-root > .MuiTableRow-root > th.MuiTableCell-root').should("contain", "1085--305");
    });

    it('Check that productAmountCell is correct and visible', () => {
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should("be.visible");
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(4)').should("contain", "4");
    });

    it('Check that productItemPriceCell is correct and visible', () => {
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)').should("be.visible");
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(5)').should("contain", "500,20");
    });

    it('Check that productTotalPriceCell is correct and visible', () => {
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(6)').should("be.visible");
        cy.get('.MuiTableBody-root > .MuiTableRow-root > :nth-child(6)').should("contain", "2000,80");
    });

    it('Check that totalPriceForAllProductsTextField is correct and visible', () => {
        cy.get('.MuiTypography-subtitle1').should("be.visible");
        cy.get('.MuiTypography-subtitle1').should("contain", "2000,80");
    });

    it('Shows 1 product line and 1 recipient line', () => {
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    // should have found 1 elements
                    expect($tr).to.have.length(4)
                }
            )
    })
});


describe('Testing saving claim', () => {
    it('Click next button is active, and click it to precede', () => {
        cy.apiIntercept(false);
        cy.get('[data-testid="saveInvoice"]').should('not.be.disabled');
        cy.get('[data-testid="saveInvoice"]').click();
    });

    // it('Click save button is active, and click it to save claim', () => {
    //     cy.apiIntercept();
    //     cy.getClaimsAfterAdd();
    //     cy.get('[data-testid="sendInvoice"]').should('not.be.disabled');
    //     cy.get('[data-testid="sendInvoice"]').click();
    // });
});