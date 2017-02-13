/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Provider edition tests
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
describe('Provider edition', () => {

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

  const name_seed  = Math.floor(Math.random() * 100),
        new_name   = faker.name.findName('Protractor-'+name_seed).substr(0, 40),
        wrong_name = "";

  beforeEach(() => {
    browser.get(url);
  });

  /* Listing and Viewing providers data */

  it('EDITION: Tapping on the small "edit" button should enable edition', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count( count => {
      let random_index = Math.floor(Math.random() * count),
          provider_el  = provider_elements.get(random_index),
          input_name    = provider_el.element(by.model('provider.name')),
          input_checked = provider_el.element(by.model('provider.checked')),
          edit_btn      = provider_el.element(by.css('.btn-small-edit')),
          delete_btn    = provider_el.element(by.css('.btn-small-delete')),
          save_btn      = provider_el.element(by.css('.btn-small-save')),
          cancel_btn    = provider_el.element(by.css('.btn-small-cancel'));

      // Required values should be displayed
      expect(input_name.isDisplayed()).toBeTruthy();
      expect(input_checked.isDisplayed()).toBeTruthy();

      // The provider shouldn't be editable
      expect(input_name.getAttribute('readonly')).toBeTruthy();

      // The checkbox should be enabled
      expect(input_checked.isEnabled()).toBeTruthy();

      // The cancel button shouldn't be visible
      expect(cancel_btn.isDisplayed()).toBeFalsy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeFalsy();

      // The edit button shouldn't be visible
      expect(edit_btn.isDisplayed()).toBeTruthy();

      // The delete button shouldn't be visible
      expect(delete_btn.isDisplayed()).toBeTruthy();

      // Start provider edition
      edit_btn.click();

      // The provider should be editable
      expect(input_name.getAttribute('readonly')).toBeFalsey();

      // The edit button should be hidden
      expect(edit_btn.isDisplayed()).toBeFalsy();

      // The cancel button should be shown
      expect(cancel_btn.isDisplayed()).toBeTruthy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeTruthy();
    });
  });

  it('EDITION: Entering a wrong provider name should invalidate the input', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          provider_el  = provider_elements.get(random_index),
          input_name    = provider_el.element(by.model('provider.name')),
          input_checked = provider_el.element(by.model('provider.checked')),
          edit_btn      = provider_el.element(by.css('.btn-small-edit')),
          delete_btn    = provider_el.element(by.css('.btn-small-delete')),
          save_btn      = provider_el.element(by.css('.btn-small-save')),
          cancel_btn    = provider_el.element(by.css('.btn-small-cancel'));

      // Required values should be displayed
      expect(input_name.isDisplayed()).toBeTruthy();
      expect(input_checked.isDisplayed()).toBeTruthy();

      // The provider shouldn't be editable
      expect(input_name.getAttribute('readonly')).toBeTruthy();

      // The checkbox should be enabled
      expect(input_checked.isEnabled()).toBeTruthy();

      // The cancel button shouldn't be visible
      expect(cancel_btn.isDisplayed()).toBeFalsy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeFalsy();

      // The edit button shouldn't be visible
      expect(edit_btn.isDisplayed()).toBeTruthy();

      // The delete button shouldn't be visible
      expect(delete_btn.isDisplayed()).toBeTruthy();

      // Start provider edition
      edit_btn.click();

      // The provider should be editable
      expect(input_name.getAttribute('readonly')).toBeFalsy();

      // The edit button should be hidden
      expect(edit_btn.isDisplayed()).toBeFalsy();

      // The cancel button should be shown
      expect(cancel_btn.isDisplayed()).toBeTruthy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeTruthy();

      // Update the input value
      input_name.clear().sendKeys(wrong_name);

      // The input should contain the new value
      expect(input_name.getAttribute('value')).toBe(wrong_name);

      // The input should be invalid
      expect(input_name.getAttribute('class')).toContain('ng-invalid');

      // The save button shouldn't be visible
      expect(save_btn.getAttribute('disabled')).toBeTruthy();
    });
  });

  it('EDITION: Setting a new provider name and canceling should reset the input', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          provider_el  = provider_elements.get(random_index),
          input_name    = provider_el.element(by.model('provider.name')),
          edit_btn      = provider_el.element(by.css('.btn-small-edit')),
          save_btn      = provider_el.element(by.css('.btn-small-save')),
          cancel_btn    = provider_el.element(by.css('.btn-small-cancel'));

      // Required values should be displayed
      expect(input_name.isDisplayed()).toBeTruthy();

      // The provider shouldn't be editable
      expect(input_name.getAttribute('readonly')).toBeTruthy();

      // The cancel button shouldn't be visible
      expect(cancel_btn.isDisplayed()).toBeFalsy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeFalsy();

      // The edit button shouldn't be visible
      expect(edit_btn.isDisplayed()).toBeTruthy();

      // Start provider edition
      edit_btn.click();

      // The provider should be editable
      expect(input_name.getAttribute('readonly')).toBeFalsy();

      // The edit button should be hidden
      expect(edit_btn.isDisplayed()).toBeFalsy();

      // The cancel button should be shown
      expect(cancel_btn.isDisplayed()).toBeTruthy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeTruthy();


      input_name.getAttribute('value').then( value => {

        // Update the input value
        input_name.clear().sendKeys(new_name);

        // The input should be invalid
        expect(input_name.getAttribute('class')).not.toContain('ng-invalid');

        // The input should contain the new value
        expect(input_name.getAttribute('value')).toBe(new_name);

        // The save button shouldn't be visible
        expect(save_btn.getAttribute('disabled')).toBeFalsy();

        // Save the new provider name
        cancel_btn.click();

        // The save button should be hidden
        expect(save_btn.isDisplayed()).toBeFalsy();

        // The cancel button should be hidden
        expect(cancel_btn.isDisplayed()).toBeFalsy();

        // The input should be readonly again
        expect(input_name.getAttribute('readonly')).toBeTruthy();

        // The input should contain the old value
        expect(input_name.getAttribute('value')).toBe(value);
      });
    });
  });

  it('EDITION: Saving the new name should update the input to readonly', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          provider_el  = provider_elements.get(random_index),
          input_name    = provider_el.element(by.model('provider.name')),
          input_checked = provider_el.element(by.model('provider.checked')),
          edit_btn      = provider_el.element(by.css('.btn-small-edit')),
          delete_btn    = provider_el.element(by.css('.btn-small-delete')),
          save_btn      = provider_el.element(by.css('.btn-small-save')),
          cancel_btn    = provider_el.element(by.css('.btn-small-cancel'));

      // Required values should be displayed
      expect(input_name.isDisplayed()).toBeTruthy();
      expect(input_checked.isDisplayed()).toBeTruthy();

      // The provider shouldn't be editable
      expect(input_name.getAttribute('readonly')).toBeTruthy();

      // The checkbox should be enabled
      expect(input_checked.isEnabled()).toBeTruthy();

      // The cancel button shouldn't be visible
      expect(cancel_btn.isDisplayed()).toBeFalsy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeFalsy();

      // The edit button shouldn't be visible
      expect(edit_btn.isDisplayed()).toBeTruthy();

      // The delete button shouldn't be visible
      expect(delete_btn.isDisplayed()).toBeTruthy();

      // Start provider edition
      edit_btn.click();

      // The provider should be editable
      expect(input_name.getAttribute('readonly')).toBeFalsy();

      // The edit button should be hidden
      expect(edit_btn.isDisplayed()).toBeFalsy();

      // The cancel button should be shown
      expect(cancel_btn.isDisplayed()).toBeTruthy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeTruthy();

      // Update the input value
      input_name.clear().sendKeys(new_name);

      // The input should be invalid
      expect(input_name.getAttribute('class')).not.toContain('ng-invalid');

      // The input should contain the new value
      expect(input_name.getAttribute('value')).toBe(new_name);

      // The save button shouldn't be visible
      expect(save_btn.getAttribute('disabled')).toBeFalsy();

      // Save the new provider name
      save_btn.click();

      // The save button should be hidden
      expect(save_btn.isDisplayed()).toBeFalsy();

      // The cancel button should be hidden
      expect(cancel_btn.isDisplayed()).toBeFalsy();

      // The input should be readonly again
      expect(input_name.getAttribute('readonly')).toBeTruthy();

    });
  });

  it('EDITION: Saving the new name should update the list', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          provider_el  = provider_elements.get(random_index),
          input_name   = provider_el.element(by.model('provider.name')),
          edit_btn     = provider_el.element(by.css('.btn-small-edit')),
          save_btn     = provider_el.element(by.css('.btn-small-save'));

      // Required values should be displayed
      expect(input_name.isDisplayed()).toBeTruthy();

      // The provider shouldn't be editable
      expect(input_name.getAttribute('readonly')).toBeTruthy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeFalsy();

      // The edit button shouldn't be visible
      expect(edit_btn.isDisplayed()).toBeTruthy();

      // Start provider edition
      edit_btn.click();

      // The provider should be editable
      expect(input_name.getAttribute('readonly')).toBeFalsy();

      // The edit button should be hidden
      expect(edit_btn.isDisplayed()).toBeFalsy();

      // The save button shouldn't be visible
      expect(save_btn.isDisplayed()).toBeTruthy();

      input_name.getAttribute('value').then( value => {

        client_elements.reduce( (amount, row) => {
          let provider_cell = row.element(by.binding('client.providers'));

          return provider_cell.getText().then( text => {
            let providers = text.split(', ');
            return amount + +providers.includes(value);
          });
        }, 0).then( rowsWithProvider => {

          // Update the input value
          input_name.clear().sendKeys(new_name);

          // The input should be invalid
          expect(input_name.getAttribute('class')).not.toContain('ng-invalid');

          // The input should contain the new value
          expect(input_name.getAttribute('value')).toBe(new_name);

          // The save button shouldn't be visible
          expect(save_btn.getAttribute('disabled')).toBeFalsy();

          // Save the new provider name
          save_btn.click();

          // The save button should be hidden
          expect(save_btn.isDisplayed()).toBeFalsy();

          // The input should be readonly again
          expect(input_name.getAttribute('readonly')).toBeTruthy();

          // The amount of rows with the new client should be equal or greater
          // than previous value
          client_elements.reduce( (amount, client_row) => {
            let provider_cell = client_row.element(by.binding('client.providers'));

            return provider_cell.getText().then( text => {
              let providers = text.split(', ');
              return amount + +providers.includes(new_name);
            });
          }, 0).then( count => expect(count).not.toBeLessThan(rowsWithProvider));
        });
      });
    });
  });
});
