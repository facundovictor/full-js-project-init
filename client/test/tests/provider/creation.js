/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Provider creation tests
 *
 * Refereces:
 *  http://www.protractortest.org/#/api
 *  https://jasmine.github.io/edge/introduction
 *  https://github.com/marak/Faker.js/
 */

'use strict';


// Import a faker library for getting name, phone and emails
const faker = require('faker');

// Test description
describe('Provider creation', () => {

  const url              = 'http://localhost:8000',
        client_ng_repeat = 'client in vm.clients | orderBy : vm.listOrder.col'+
                           'umn : vm.listOrder.reverse | filter : vm.searchFi'+
                           'eld',
        provider_ng_repeat = 'provider in vmProvider.providers track by provi'+
                             'der.id';

  const client_elements   = element.all(by.repeater(client_ng_repeat)),
        new_client_button = element(by.css('.buttons .add')),
        modal_form        = element(by.css('.modal-shadow.modal-form')),

        // Provider form elements
        provider_form      = element(by.css('.modal-shadow.modal-form .provider-form')),
        provider_elements  = element.all(by.repeater(provider_ng_repeat)),
        new_provider_input = element(by.model('vmProvider.newProviderName')),
        add_provider_btn   = element(by.css('.provider-button'));

  const new_name   = faker.name.findName('Protractor').substr(0, 50),
        wrong_name = "";

  beforeEach(() => {
    browser.get(url);
  });

  /* Listing and Viewing providers data */

  it('CREATION: Setting an empty name should disable the add button', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The new provider input should be displayed
    expect(new_provider_input.isDisplayed()).toBeTruthy();

    // The new provider input should be empty
    new_provider_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // The new provider input should be displayed
    expect(new_provider_input.isDisplayed()).toBeTruthy();

    // The add provider button should be displayed
    expect(add_provider_btn.isDisplayed()).toBeTruthy();

    // The add provider button should be disabled
    expect(add_provider_btn.isEnabled()).toBeFalsy();

    // Set the wrong name
    new_provider_input.clear().sendKeys(wrong_name);

    // The add provider button should be disabled, still
    expect(add_provider_btn.isEnabled()).toBeFalsy();
  });

  it('CREATION: Setting a non empty name should enable the add button', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The new provider input should be displayed
    expect(new_provider_input.isDisplayed()).toBeTruthy();

    // The new provider input should be empty
    new_provider_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // The new provider input should be displayed
    expect(new_provider_input.isDisplayed()).toBeTruthy();

    // The add provider button should be displayed
    expect(add_provider_btn.isDisplayed()).toBeTruthy();

    // The add provider button should be disabled
    expect(add_provider_btn.isEnabled()).toBeFalsy();

    // Set the wrong name
    new_provider_input.clear().sendKeys(new_name);

    // The add provider button should be disabled
    expect(add_provider_btn.isEnabled()).toBeTruthy();
  });

  it('CREATION: Saving a non empty provider should update the list', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The new provider input should be displayed
    expect(new_provider_input.isDisplayed()).toBeTruthy();

    // The new provider input should be empty
    new_provider_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // The new provider input should be displayed
    expect(new_provider_input.isDisplayed()).toBeTruthy();

    // The add provider button should be displayed
    expect(add_provider_btn.isDisplayed()).toBeTruthy();

    // The add provider button should be disabled
    expect(add_provider_btn.isEnabled()).toBeFalsy();

    // Set the wrong name
    new_provider_input.clear().sendKeys(new_name);

    // The new provider input should contain the new name
    expect(new_provider_input.getAttribute('value')).toBe(new_name);

    // The add provider button should be disabled
    expect(add_provider_btn.isEnabled()).toBeTruthy();

    provider_elements.count().then( count => {

      // Save the provider
      add_provider_btn.click();

      // There should be a new provider in the list
      expect(provider_elements.count()).toBe( count + 1 );

      // There should be a provider with the new name
      expect(provider_elements.reduce((isPresent, provider_el) => {
        const input_name = provider_el.element(by.model('provider.name'));

        return input_name.getAttribute('value').then( value => {
          return isPresent || (value === new_name);
        });
      }, false)).toBeTruthy();
    });
  });
});
