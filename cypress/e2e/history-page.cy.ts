describe('Check the claim history page',
    {
        env: {
            language: 'es',
        },
    },
    () => {
        // beforeEach(() => {
        //   // run these tests as if in a desktop
        //   // browser with a 720p monitor
        //   cy.viewport(1000, 1200);
        // });

        // before(() => {
        //   cy.apiIntercept(true);
        // })

        beforeEach(() => {
            cy.fixture('claims.json').then((user) => {
                // "this" is still the test context object
                var x = user.find(({orderNumber}) => orderNumber === "102535");
                Cypress.env('language', x);
            }).as('claims')
        })

        it('This is just a test....', function () {
            cy.log(`There are ${this.claims.length} ${Cypress.env('language')}.`)
        })

        // it('Click create claim from main menu works', () => {
        //     cy.apiIntercept(true);
        //     cy.goToHome();
        //     cy.get(':nth-child(3) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
        //     cy.url().should('include', '/betaling/historikk');
        // });
        //
        // it('Title of page', () => {
        //     cy.get('[data-testid="pageTitle"]').contains("Ordre historikk");
        // });
        //
        // it('Dropdown for dates', () => {
        //     cy.changeDate();
        //     cy.get('[data-testid="selectDate"] > #uncontrolled-native').select(1);
        // });
        //
        // it('Dropdown for schools', () => {
        //     cy.changeSelection();
        //     cy.get('[data-testid="selectSchool"] > #uncontrolled-native').select(1);
        // });
        //
        // it('Resend button exists', () => {
        //     cy.get('[data-testid="resendButton"]').should("be.enabled");
        // });
        //
        // it('Select to resend', () => {
        //     cy.get('.MuiDataGrid-columnHeaderTitleContainerContent > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        //     cy.get('.MuiDataGrid-selectedRowCount').contains("2");
        //     cy.wait(500);
        //     cy.get('.MuiDataGrid-columnHeaderTitleContainerContent > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        // });
        //
        // it('Chip should have a popover', () => {
        //     cy.get('[data-id="102535"] > .MuiDataGrid-cell--withRenderer.MuiDataGrid-cell--textLeft > :nth-child(1) > .MuiButtonBase-root').click();
        //     cy.get('#alert-dialog-title').should("be.visible");
        //     cy.get('.MuiDialogActions-root > .MuiButtonBase-root').should("be.visible");
        //     cy.wait(500);
        //     cy.get('.MuiDialogActions-root > .MuiButtonBase-root').click();
        // });
    }
);