describe('Testing selecting recipients', () => {
    it('Click create claim from main menu works', () => {
        cy.apiIntercept();
        cy.goToHome();
        cy.get("#menuList").children().contains("Opprett ordre").click();
        cy.url().should('include', '/betaling/ny');
    });
    it('Placeholder on searchField is correct', () => {
            cy.get('legend').first().should("contain", "Søk på gruppenavn");
        }
    );
    it('Search for groups works', () => {
            cy.get("#recipientSearchField").type("1");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(6)
                    }
                )
        }
    );
    it('Select one group', () => {
            cy.get("tr")
                .next()
                .next()
                .first()
                .find('input')
                .click();
        }
    );
    it('Remove one group', () => {
            cy.get("tr")
                .next()
                .next()
                .first()
                .find('input')
                .click();
        }
    );
    it('Select one group and remove one user', () => {
            cy.get("tr")
                .next()
                .next()
                .first()
                .find('input')
                .click();
            cy.get("#recipientList")
                .children()
                .should(
                    ($li) => {
                        expect($li).to.have.length(5);
                    }
                );
            cy.get("#removeOneRecipientIcon").first().click();
            cy.get("#confirmRemoveOneRecipientIcon").first().click();
            cy.get("#recipientList")
                .children()
                .should(
                    ($li) => {
                        expect($li).to.have.length(4);
                    }
                )
        }
    );
    it('Remove all recipients with delete all button', () => {
            cy.get("#removeAllIcon").click();
            cy.get("#confirmRemoveAllIcon").click();
            cy.get("#recipientList")
                .children()
                .should(
                    ($li) => {
                        expect($li).to.have.length(0);
                    }
                )
        }
    );
    it('Test colapse function', () => {
            cy.get("#collapseArrowIconOpen").click();
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(11)
                    }
                );
            cy.get("#collapseArrowIconClose").click();
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(6)
                    }
                );
        }
    );
    it('Activate person search', () => {
        cy.get("#personRadioButtonAtRecipientSearch").click();
    });
    it('Placeholder on searchField is changed now that person is selected', () => {
            cy.get('legend').first().should("contain", "Søk på etternavn, fornavn mellomnavn");
        }
    );
    it('Search for student', () => {
            cy.get("#recipientSearchField").type("Test");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(5)
                    }
                )
        }
    );
    it('Select one student', () => {
            cy.get("tr")
                .next()
                .first()
                .find('input')
                .click();
        }
    );
});
describe('Testing selecting products', () => {
    it('"Videre"-button is active', () => {
            cy.apiIntercept();
            cy.get('#recipientGoToProductsButton').should('not.be.disabled');
            cy.get('#recipientGoToProductsButton').click();
        }
    );
    it('Title is correct', () => {
            cy.get('#productPageTitle').should("contain", "Velg produkt");
        }
    );
    it('Placeholder on searchField is correct', () => {
            cy.get('legend').first().should("contain", "Søk på produktnavn eller produktkode");
        }
    );
    it('Search for products works', () => {
            cy.get("#productSearchField").type("1");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(2)
                    }
                )
        }
    );
    it('Select one product', () => {
            cy.get("tr")
                .next()
                .first()
                .find('input')
                .first()
                .click();
        }
    );
    it('Remove the product', () => {
            cy.get("tr")
                .next()
                .first()
                .find('input')
                .first()
                .click();
        }
    );
    it('Add the product for further testing', () => {
            cy.get("tr")
                .next()
                .first()
                .find('input')
                .first()
                .click();
        }
    );
    it('Change price', () => {
            cy.get("tr")
                .next()
                .first()
                .find('#productKronerField')
                .type("500");
            cy.get("tr")
                .next()
                .first()
                .find('#productOreField')
                .type("20");
        }
    );
    it('Check that price is correct for row', () => {
        cy.get("tr")
            .next()
            .first()
            .find('#productPriceCell')
            .should("contain", "500,20");
    });
    it('Change quantity', () => {
            cy.get("tr")
                .next()
                .first()
                .find('#productAmountField')
                .clear()
                .type("4");
        }
    );
    it('Check that price is correct for row', () => {
        cy.get("tr")
            .next()
            .first()
            .find('#productPriceCell')
            .should("contain", "20508,20");
    });
    it('Add text to free text field', () => {
        cy.get("tr")
            .next()
            .first()
            .find('#freeTextTextField')
            .type("test fritekst");
    });
});
describe('Testing summary page', () => {
    it('Click next button is active, and click it to enter summary', () => {
        cy.apiIntercept();
        cy.get("#nextButtonToSummary").should('not.be.disabled');
        cy.get("#nextButtonToSummary").click();
    });
    it('Check that summaryTitle is correct and visible', () => {
            cy.get('#summaryTitle').should("be.visible");
            cy.get('#summaryTitle').should("contain", "Lagre betaling");
        }
    );
    it('Check that recipientNameCell is correct and visible', () => {
            cy.get('#recipientNameCell').should("be.visible");
            cy.get('#recipientNameCell').should("contain", "Testbruker, Nummer Fem");
        }
    );
    it('Check that productDescriptionCell is correct and visible', () => {
            cy.get('#productDescriptionCell').should("be.visible");
            cy.get('#productDescriptionCell').should("contain", "DIVERSE SALG MED MVA");
        }
    );
    it('Check that productFreeTextCell is correct and visible', () => {
            cy.get('#productFreeTextCell').should("be.visible");
            cy.get('#productFreeTextCell').should("contain", "test fritekst");
        }
    );
    it('Check that summaryTitle is correct and visible', () => {
            cy.get('#productCodeCell').should("be.visible");
            cy.get('#productCodeCell').should("contain", "1085--305");
        }
    );
    it('Check that productAmountCell is correct and visible', () => {
            cy.get('#productAmountCell').should("be.visible");
            cy.get('#productAmountCell').should("contain", "41");
        }
    );
    it('Check that productItemPriceCell is correct and visible', () => {
            cy.get('#productItemPriceCell').should("be.visible");
            cy.get('#productItemPriceCell').should("contain", "500,20");
        }
    );
    it('Check that productTotalPriceCell is correct and visible', () => {
            cy.get('#productTotalPriceCell').should("be.visible");
            cy.get('#productTotalPriceCell').should("contain", "20508,20");
        }
    );
    it('Check that totalPriceForAllProductsTextField is correct and visible', () => {
            cy.get('#totalPriceForAllProductsTextField').should("be.visible");
            cy.get('#totalPriceForAllProductsTextField').should("contain", "20508,20");
        }
    );
    it('Shows 1 product line and 1 recipient line', () => {
        cy.get("tbody")
            .children()
            .should(
                ($tr) => {
                    // should have found 1 elements
                    expect($tr).to.have.length(2)
                }
            )
    })
});
describe('Testing saving claim', () => {
    it('Click next button is active, and click it to precede', () => {
        cy.apiIntercept();
        cy.get("#saveClaimButton").should('not.be.disabled');
        cy.get("#saveClaimButton").click();
    });
    it('Click save button is active, and click it to save claim', () => {
        cy.getClaimWithNewClaim();
        cy.get("#saveClaimButton").should('not.be.disabled');
        cy.get("#saveClaimButton").click();
    });
    it('Unsent button indicates 2 unsent claim', () => {
            cy.get("#unsentAlertButton").contains("2");
        }
    );
    it('List shows the 2 unsent claims', () => {
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(3)
                    }
                )
        }
    );
    it('Search for ordernumber works', () => {
            cy.get("#sendToInvoiceSearchField").type("102599");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(2)
                    }
                )
        }
    );
    it('Delete order should be disabled', () => {
            cy.get("#deleteOrderButton").should("be.disabled");
        }
    );
    it('Selecting the claim works', () => {
            cy.get("tr")
                .find('input')
                .last()
                .click();
        }
    );
    it('Delete order should be enabled', () => {
            cy.get("#deleteOrderButton").should("not.be.disabled");
        }
    );
    it('Delete order with cancelling', () => {
            cy.get("#deleteOrderButton").click();
            cy.get("#cancelDeleteOrderButton").click();
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(2)
                    }
                )
        }
    );
    it('Delete order with confirming', () => {
        cy.apiIntercept();
        cy.get("#deleteOrderButton").click();
            cy.get("#confirmDeleteOrderButton").click();
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(1)
                    }
                )
        }
    );
    it('Send order to mock backend', () => {
        cy.apiIntercept();
        cy.get("#sendToInvoiceSearchField").clear();
            cy.get("tr")
                .find('input')
                .last()
                .click();
            cy.get("#sendOrderToInvoicingButton").click();
        }
    );
    it('Snackbar showing 1 order sent', () => {
        cy.get("#sendOrderSnackbar").contains("1 ordre er sendt til økonomisystemet!")
        }
    );

});
