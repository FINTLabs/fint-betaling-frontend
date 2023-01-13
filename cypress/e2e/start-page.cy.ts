describe('Testing start page', () => {
  it('Logo and FINT Betaling found', () => {
    cy.apiIntercept(true);
    // cy.getClaimsBeforeAdd();
    cy.goToHome();
    cy.get('[data-testid="toolbar"]').contains("FINT Elevfakturering");
    cy.apiIntercept();
  });

  it('Name is displayed', () => {
        cy.get('[data-testid="userNameField"]').contains("Test Testesen");
      }
  );

  it('Menu exists, can open', () => {
    cy.apiIntercept();
    cy.get('.MuiDrawer-root > .MuiIconButton-root').should('not.exist');
    cy.get('.MuiToolbar-root > :nth-child(1) > .MuiSvgIcon-root').click()
    cy.get('.MuiDrawer-root > .MuiPaper-root').should('be.visible');
  });

  it('Menu has 5 links', () => {
        cy.apiIntercept();
        cy.get(".MuiDrawer-root > .MuiPaper-root")
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
        cy.get(".MuiDrawer-root > .MuiPaper-root").children().contains("Opprett ordre").click();
        cy.url().should('include', '/betaling/ny');
        cy.apiIntercept();
        cy.get(".MuiDrawer-root > .MuiPaper-root").children().contains("Send ordre").click();
        cy.url().should('include', '/betaling/send');
        cy.apiIntercept();
        cy.get(".MuiDrawer-root > .MuiPaper-root").children().contains("Ordrehistorikk").click();
        cy.url().should('include', '/betaling/historikk');
        cy.apiIntercept();
        cy.get(".MuiDrawer-root > .MuiPaper-root").children().contains("Hjem").click();
      }
  );

  it('Menu can close', () => {
    cy.apiIntercept();
    cy.get('.MuiDrawer-root > .MuiPaper-root').should('be.visible');
    cy.get('[data-testid="ChevronLeftIcon"]').click()
    cy.get('.MuiDrawer-root > .MuiIconButton-root').should('not.exist');
  });

  it('Unsent button exists', () => {
    cy.apiIntercept();
    cy.get('[data-cy="UnsentAlertButton"]').should('be.visible');
  });

  it.skip('Unsent button indicates 1 unsent claim', () => {
    cy.apiIntercept();
    cy.get('[data-cy="NotificationsIcon"] >.MuiBadge-anchorOriginTopRight').contains("1");
  });

  it('Unsent field message box shows, has correct links, closes', () => {
    cy.apiIntercept();
    cy.get('[data-testid="NotificationsIcon"] > path').click();
    cy.get('.MuiDialogContent-root').should('be.visible');
    cy.get('.MuiDialogActions-root > a.MuiButtonBase-root').contains("Gå til send ordre").click();
    cy.url().should('include', '/betaling/send');
    cy.go('back');
    cy.get('[data-testid="NotificationsIcon"] > path').click();
    cy.wait(500);
    cy.get('.MuiDialogActions-root > button.MuiButtonBase-root').contains("Lukk");
    cy.get('.MuiDialogActions-root > button.MuiButtonBase-root').contains("Lukk").click();
  });

  it('Error button exists', () => {
    cy.apiIntercept();
    cy.get('[data-testid="ErrorIcon"]').should('be.visible');
  });

  it.skip('Error field message box shows, has correct links, closes', () => {
    cy.apiIntercept();
    cy.get('[data-testid="ErrorIcon"] > path').click();
    cy.get('.MuiDialogContent-root').should('be.visible');
    cy.get('.MuiDialogActions-root > a.MuiButtonBase-root').contains("Gå til send ordre");
    cy.get('.MuiDialogActions-root > button.MuiButtonBase-root').contains("Lukk");
    cy.get('[data-testid="ErrorIcon"] > path').click();
  });

  it('schoolSelector exists, has correct school', () => {
    cy.apiIntercept();
    cy.get('[data-testid="schoolSelector"]').should('be.visible');
    cy.get('[data-testid="schoolSelector"]').contains('Fagskolen i Østfold');
  });

  it('schoolSelector shows correct school when changing', () => {
    cy.apiIntercept();
    cy.get('[data-testid="schoolSelector"]').click();
    cy.get('#simple-menu > .MuiPaper-root > .MuiList-root').contains("Testskolen videregående skole");
    cy.get('#simple-menu > .MuiPaper-root > .MuiList-root').contains("Testskolen videregående skole").click();
    cy.get('[data-testid="schoolSelector"]').contains('Testskolen videregående skole');
    cy.get('body').click(0,0);
  });

  it('Check that we have 3 cards', () => {
    cy.apiIntercept();
    cy.get('[data-testid="homepageCards"]').should('be.visible');
    cy.get('.MuiGrid-container')
        .find('a')
        .should(
            ($tr) => {
              expect($tr).to.have.length(3)
            })
  });

  it('Make sure cards have correct links', () => {
    cy.apiIntercept();
    cy.get(':nth-child(1) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
    cy.url().should('include', '/betaling/ny');
    cy.go('back');

    cy.get(':nth-child(2) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
    cy.url().should('include', '/betaling/send');
    cy.go('back');

    cy.get(':nth-child(3) > .MuiPaper-root > .MuiCardActions-root > .MuiButtonBase-root').click();
    cy.url().should('include', '/betaling/historikk');
    cy.go('back');
  });
});