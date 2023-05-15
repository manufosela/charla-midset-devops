const assert = require('assert')
const { Given, When, Then } = require('@cucumber/cucumber')
const { Greeter } = require('../../src')

Given('un objecto greeter', function () {
  this.greeter = new Greeter();
});

When('el objeto greeter dice hola', function () {
  this.whatIHeard = this.greeter.sayHello()
});

Then('Debería decir {string}', function (expectedResponse) {
  assert.equal(this.whatIHeard, expectedResponse)
});