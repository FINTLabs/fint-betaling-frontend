describe('Testing order history', () => {
    it('Click create claim from main menu works', () => {
        cy.apiIntercept();
        cy.goToHome();
        cy.get("#menuList").children().contains("Ordrehistorikk").click();
        cy.url().should('include', '/betaling/historikk');
    });
    it('Placeholder on searchField is correct', () => {
            cy.get('legend').first().should("contain", "Søk på ordrenummer");
        }
    );
    it('Search for groups works', () => {
            cy.get("#paymentSearchField").type("1");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(10)
                    }
                )
        }
    );
    it('Filtering should reduce rows', () => {
            cy.get("#paymentSearchField").clear();
            cy.get("#paymentHistoryFilter").click();
            cy.get("li").last().click();
            cy.get("#paymentSearchField").type("1");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(1)
                    }
                );
            cy.get("#paymentSearchField").clear();
            cy.get("#paymentHistoryFilter").click();
            cy.get("ul").last().contains("Alle").click();
        }
    );
    it('Select name search', () => {
        cy.get("#nameRadioButtonAtRecipientSearch").click();
    });
    it('Search for name works', () => {
            cy.get("#paymentSearchField").type("Cypress");
            cy.get("tbody")
                .children()
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(1)
                    }
                )
        }
    );
    it('Icon text should be present', () => {
            cy.get("tr").last().get("#paymentHistoryStatusIconCell").should("contain", "Sendt til økonomisystem");
        }
    );
    it('Name should be present', () => {
            cy.get("tr").last().get("#paymentHistoryNameCell").should("contain", "Testesen, Cypress");
        }
    );
    it('Order number should be present', () => {
            cy.get("tr").last().get("#paymentHistoryOrderNumberCell").should("contain", "102537");
        }
    );
    it('Invoice number should be present', () => {
            cy.get("tr").last().get("#paymentHistoryInvoiceNumberCell").should("contain", "313000373");
        }
    );
    it('Original amount should be present', () => {
            cy.get("tr").last().get("#paymentHistoryOriginalAmountDueCell").should("contain", "1500,-");
        }
    );
    it('Amount due should be present', () => {
            cy.get("tr").last().get("#paymentHistoryAmountDueCell").should("contain", "1500,-");
        }
    );
});