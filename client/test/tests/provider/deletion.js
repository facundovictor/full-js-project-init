/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Provider deletion tests
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
describe('Provider deletion', () => {

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

  it('DELETION: Tapping on the small "delete" button should update the provider list', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count().then( count => {
      if (count) {
        let random_index = Math.floor(Math.random() * count),
            provider_el  = provider_elements.get(random_index),
            input_name   = provider_el.element(by.model('provider.name')),
            delete_btn   = provider_el.element(by.css('.btn-small-delete'));

        // Required values should be displayed
        expect(input_name.isDisplayed()).toBeTruthy();

        // The provider shouldn't be editable
        expect(input_name.getAttribute('readonly')).toBeTruthy();

        // The delete button shouldn't be visible
        expect(delete_btn.isDisplayed()).toBeTruthy();

        // Start provider edition
        delete_btn.click();

        // The count should be reduced by 1
        expect(provider_elements.count()).toBe( count - 1 );
      }
    });
  });

  it('DELETION: Tapping on the small "delete" button should update the client list', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.count().then( count => {
      if (count) {
        let random_index = Math.floor(Math.random() * count),
            provider_el  = provider_elements.get(random_index),
            input_name   = provider_el.element(by.model('provider.name')),
            delete_btn   = provider_el.element(by.css('.btn-small-delete'));

        // Required values should be displayed
        expect(input_name.isDisplayed()).toBeTruthy();

        // The provider shouldn't be editable
        expect(input_name.getAttribute('readonly')).toBeTruthy();

        // The delete button shouldn't be visible
        expect(delete_btn.isDisplayed()).toBeTruthy();

        // Recover the value to compare
        input_name.getAttribute('value').then( value => {
          client_elements.reduce( (amount, row) => {
            let provider_cell = row.element(by.binding('client.providers'));

            return provider_cell.getText().then( text => {
              let providers = text.split(', ');
              return amount + +providers.includes(value);
            });
          }, 0).then( rowsWithProvider => {
   
            // Start provider edition
            delete_btn.click();
   
            // The count should be reduced by 1
            expect(provider_elements.count()).toBe( count - 1 );

            // The amount of rows with the new client should be equal or less
            // than previous value
            client_elements.reduce( (amount, row) => {
              let provider_cell = row.element(by.binding('client.providers'));
   
              return provider_cell.getText().then( text => {
                let providers = text.split(', ');
                return amount + +providers.includes(value);
              });
            }, 0).then( count => expect(count).toBeLessThan(rowsWithProvider));
          });
        });
      }
    });
  });

});
