describe('Testing start page', () => {
    it('Logo and FINT Betaling found', () => {
        cy.apiIntercept();
        cy.goToHome();
        cy.get("#toolbar").contains("FINT Betaling");
            cy.apiIntercept();
    });
    it('Name is displayed', () => {
            cy.get("#userNameField").contains("Test Testesen");
        }
    );
    it('Menu exists, can open, and has menuitems', () => {
        cy.apiIntercept();
        cy.get("#menuBurger").should('be.visible');
        cy.get("#HomeMenuButtonText").should('not.be.visible');
        cy.get("#menuBurger").click();
        cy.get("#HomeMenuButtonText").should('be.visible');
        cy.get("#HomeMenuButton").should('be.visible');
    });
    it('Menu has 5 links', () => {
            cy.apiIntercept();
            cy.get("#menuList")
                .find('a')
                .should(
                    ($tr) => {
                        expect($tr).to.have.length(5)
                    }
                )
        }
    );
    it('Testing menu buttons clicks', () => {
            cy.apiIntercept();
            cy.get("#menuList").children().contains("Opprett ordre").click();
            cy.url().should('include', '/betaling/ny');
            cy.apiIntercept();
            cy.get("#menuList").children().contains("Send ordre").click();
            cy.url().should('include', '/betaling/send');
            cy.apiIntercept();
            cy.get("#menuList").children().contains("Ordrehistorikk").click();
            cy.url().should('include', '/betaling/historikk');
            cy.apiIntercept();
            cy.get("#menuList").children().contains("Hjem").click();
        }
    );
    it('Menu can close', () => {
            cy.apiIntercept();
            cy.get(".makeStyles-toolbar-10")
                .find('button').click()
            cy.get("#HomeMenuButtonText").should('not.be.visible');

        }
    );
    it('Unsent button exists', () => {
            cy.apiIntercept();
            cy.get("#unsentAlertButton").should('be.visible');
        }
    );
    it('Unsent button indicates 1 unsent claim', () => {
            cy.apiIntercept();
            cy.get("#unsentAlertButton").contains("1");
        }
    );
    it('Unsent field shows message', () => {
            cy.apiIntercept();
            cy.get("#unsentAlertButton").children('button').click();
            cy.get("#unsentMessageField").should('be.visible');
            cy.get("#unsentAlertButton").children('button').click();
        }
    );
    it('Unsent field button takes you to correct url', () => {
            cy.apiIntercept();
            cy.get("#unsentAlertButton").children('button').click();
            cy.get("#unsentButtonShortCut").click();
            cy.url().should('include', '/betaling/send');
        }
    );
    it('Error button exists', () => {
            cy.apiIntercept();
            cy.get("#errorAlertButton").should('be.visible');
        }
    );
    it('Error button indicates 1 error', () => {
            cy.apiIntercept();
            cy.get("#errorAlertButton").contains("1");
        }
    );
    it('Error field shows message', () => {
            cy.apiIntercept();
            cy.get("#errorAlertButton").children('button').click();
            cy.get("#errorMessageField").should('be.visible');
            cy.get("#errorAlertButton").children('button').click();
        }
    );
    it('Error field button takes you to correct url', () => {
            cy.apiIntercept();
            cy.get("#errorAlertButton").children('button').click();
            cy.get("#errorButtonShortCut").click();
            cy.url().should('include', '/betaling/historikk');
            cy.get("#HomeMenuButton").click()
        }
    );
    it('schoolSelector exists', () => {
            cy.apiIntercept();
            cy.get("#schoolSelector").should('be.visible');
        }
    );
    it('schoolSelector shows correct school when changing', () => {
            cy.apiIntercept();
            cy.get("#schoolSelector").click();
            cy.get('#999999999').click();
            cy.get("#schoolSelector").contains("Testskolen videregående skole")
            cy.get("#schoolSelector").click();
            cy.get('#974544520').click();
        }
    );
    it('Card menu "Opprett ordre" takes you to correct url', () => {
            cy.apiIntercept();
            cy.get("#startPageNewPaymentCard").within(() => {
                cy.get('a').click()
            })
            cy.url().should('include', '/betaling/ny');
            cy.get("#HomeMenuButton").click()
        }
    );
    it('Card menu "Send ordre" takes you to correct url', () => {
            cy.apiIntercept();
            cy.get("#startPageSendPaymentCard").within(() => {
                cy.get('a').click()
            })
            cy.url().should('include', '/betaling/send');
            cy.get("#HomeMenuButton").click()
        }
    );
    it('Card menu "Ordrehistorikk" takes you to correct url', () => {
            cy.apiIntercept();
            cy.get("#startPagePaymentHistoryCard").within(() => {
                cy.get('a').click()
            })
            cy.url().should('include', '/betaling/historikk');
            cy.get("#HomeMenuButton").click()
        }
    );
});