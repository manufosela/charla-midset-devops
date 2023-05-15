# MINDSET DEVOPS

## TDD

### Configuración

```shell
mkdir tdd
cd tdd
mkdir src
npm init -y
npm install --save-dev jest
```

Crear archivo jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.js'],
};
```

Crear archivo sum.test.js en src

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Ejecutamos:

```shell
npx jest
```

## BDD

### Configuración

```shell
npm init -y
npm install --save-dev @cucumber/cucumber @cucumber/gherkin chai
```

```shell
mkdir features
cd features
```

Creamos el fichero hello_world.feature dentro de la carpeta features

```gherkin
Feature: Hello world
  Scenario: Saying hello
    Given I have a greeting
    When I say hello
    Then I should see "Hello, world!"
```

Crea el directorio *support* dentro de features
Dentro el fichero hello_world.steps.js

```javascript
const { Given, When, Then } = require('cucumber');

let greeting;
let message;

Given('I have a greeting', function () {
  greeting = 'Hello';
});

When('I say hello', function () {
  message = greeting + ', world!';
});

Then('I should see {string}', function (expectedMessage) {
  if (message !== expectedMessage) {
    throw new Error(`Expected "${expectedMessage}", but got "${message}"`);
  }
});
```

Ejecutar el test

```shell
npx cucumber-js
```

## Otro ejemplo mas complejo

Creamos el fichero login.feature dentro de la carpeta features

```gherkin
Feature: Iniciar sesión
  Como usuario registrado
  Quiero poder iniciar sesión en mi cuenta

  Scenario: Iniciar sesión con éxito
    Given que estoy en la página de inicio de sesión
    When ingreso mi correo electrónico y mi contraseña
    And hago clic en el botón "Iniciar Sesión"
    Then debería ser redirigido a mi perfil

  Scenario: Iniciar sesión con correo electrónico incorrecto
    Given que estoy en la página de inicio de sesión
    When ingreso un correo electrónico incorrecto
    And ingreso mi contraseña
    And hago clic en el botón "Iniciar Sesión"
    Then debería ver el mensaje de error "El correo electrónico o la contraseña son incorrectos"

  Scenario: Iniciar sesión con contraseña incorrecta
    Given que estoy en la página de inicio de sesión
    When ingreso mi correo electrónico
    And ingreso una contraseña incorrecta
    And hago clic en el botón "Iniciar Sesión"
    Then debería ver el mensaje de error "El correo electrónico o la contraseña son incorrectos"

  Scenario: Olvidé mi contraseña
    Given que estoy en la página de inicio de sesión
    When hago clic en el enlace "Olvidé mi contraseña"
    And ingreso mi correo electrónico
    And hago clic en el botón "Enviar"
    Then debería ver el mensaje de confirmación "Se ha enviado un correo electrónico para restablecer tu contraseña"
```

Crea el directorio support dentro de features
Dentro creamos el fichero login.steps.js

```javascript
const { Given, When, Then } = require('cucumber');
const { expect } = require('chai');
const LoginPage = require('../pages/login.page');

const loginPage = new LoginPage();

Given('que estoy en la página de inicio de sesión', async function () {
  await loginPage.open();
});

When('ingreso mi correo electrónico y mi contraseña', async function () {
  await loginPage.login('miusuario@ejemplo.com', 'micontraseña');
});

When('ingreso un correo electrónico incorrecto', async function () {
  await loginPage.login('correo.incorrecto@ejemplo.com', 'micontraseña');
});

When('ingreso una contraseña incorrecta', async function () {
  await loginPage.login('miusuario@ejemplo.com', 'contraseña.incorrecta');
});

When('hago clic en el enlace {string}', async function (linkText) {
  await loginPage.clickLink(linkText);
});

When('ingreso mi correo electrónico', async function () {
  await loginPage.enterEmail('miusuario@ejemplo.com');
});

When('hago clic en el botón {string}', async function (buttonText) {
  await loginPage.clickButton(buttonText);
});

Then('debería ser redirigido a mi perfil', async function () {
  const title = await loginPage.getTitle();
  expect(title).to.equal('Perfil');
});

Then('debería ver el mensaje de error {string}', async function (errorMessage) {
  const message = await loginPage.getErrorMessage(errorMessage);
expect(message).to.equal(errorMessage);
});

Then('debería ver el mensaje de confirmación {string}', async function (confirmationMessage) {
const message = await loginPage.getConfirmationMessage();
expect(message).to.equal(confirmationMessage);
});
```

Crea el fichero login.js en el directorio src

```javascript
const { By, until } = require('selenium-webdriver');
const BasePage = require('./base.page');

class LoginPage extends BasePage {
  constructor() {
    super();
    this.url = 'https://www.ejemplo.com/login';
    this.title = 'Iniciar sesión';
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickButton('Iniciar Sesión');
  }

  async enterEmail(email) {
    const emailField = By.id('email');
    await this.driver.wait(until.elementLocated(emailField));
    await this.driver.findElement(emailField).sendKeys(email);
  }

  async enterPassword(password) {
    const passwordField = By.id('password');
    await this.driver.wait(until.elementLocated(passwordField));
    await this.driver.findElement(passwordField).sendKeys(password);
  }

  async clickButton(buttonText) {
    const button = By.xpath(`//button[contains(text(),'${buttonText}')]`);
    await this.driver.wait(until.elementLocated(button));
    await this.driver.findElement(button).click();
  }

  async clickLink(linkText) {
    const link = By.xpath(`//a[contains(text(),'${linkText}')]`);
    await this.driver.wait(until.elementLocated(link));
    await this.driver.findElement(link).click();
  }

  async getErrorMessage() {
    const errorDiv = By.className('error');
    await this.driver.wait(until.elementLocated(errorDiv));
    const errorMessage = await this.driver.findElement(errorDiv).getText();
    return errorMessage;
  }

  async getConfirmationMessage() {
    const confirmationDiv = By.className('confirmation');
    await this.driver.wait(until.elementLocated(confirmationDiv));
    const confirmationMessage = await this.driver.findElement(confirmationDiv).getText();
    return confirmationMessage;
  }
}

module.exports = LoginPage;
```

Ejecutar

```shell
npx cucumber-js
```
