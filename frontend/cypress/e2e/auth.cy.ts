describe("Auth", () => {
  beforeEach(() => {
    cy.visit("/login", {
      onBeforeLoad: (win) => {
        win.sessionStorage.clear();
      }
    });
  });

  it("should display login error", () => {
    cy.get("[data-cy=errorContainer]").should("not.be.visible");

    // click on submit button without entering credentials
    cy.get("button[type=submit]").click();

    cy.get("[data-cy=errorContainer]").should("be.visible");
  });

  it("should redirect unauthenticated user to login page", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/login");
  });

  it("should allow user to login, onboard and logout", () => {
    // intercept backend requests and replace response with mock data
    cy.intercept("POST", "**/api/auth/login", {statusCode: 201, fixture: "auth.json"}).as("auth");
    cy.intercept("GET", "**/api/users/*", {fixture: "users.json"}).as("users");
    cy.intercept("GET", "**/api/dishes?userId=*", []).as("ownDishes");

    const mockLoginData = {
      email: "admin@admin.de",
      password: "admin"
    }

    // fill out login form and submit
    cy.get("input[type=email]").type(mockLoginData.email);
    cy.get("input[type=password]").type(`${mockLoginData.password}{enter}`); 

    cy.wait("@auth").its('response.statusCode').should('eq', 201);

    // should show home page
    cy.location("pathname").should("eq", "/");

    cy.wait("@users");
    cy.wait("@ownDishes");

    // UI should display username
    cy.fixture("users").then(user => {
      cy.get("[data-cy=username]").should("contain", user.username);
    });

    // click on profile image, should route to profile page
    cy.get("[data-cy=profile-pic]").click();
    cy.location("pathname").should("eq", "/profile");

    cy.wait("@users");
    cy.wait("@ownDishes");

    // click on logout button, should route to login page
    cy.contains("Logout").click({force: true});
    cy.location("pathname").should("eq", "/login");
  });
});
