/* LoginPage.js
 * Page object model for the SauceDemo login page
 * Encapsulates the interactions with the login page of SauceDemo
 * so that tests can call methods on this page object rather than
 * directly interacting with selectors in the test code.
 */

const CONFIG = require("./config");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByPlaceholder("Username");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
  }
  async goto() {
    await this.page.goto(CONFIG.SAUCE_DEMO_URL);
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.page.getByText(/Epic sadface:/);
  }
}
module.exports = LoginPage;
