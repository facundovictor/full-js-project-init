/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Provider view tests
 *
 * Refereces:
 *  http://www.protractortest.org/#/api
 *  https://jasmine.github.io/edge/introduction
 *  https://github.com/marak/Faker.js/
 */

'use strict';


// Test description
describe('Provider view', () => {

  const url                = 'http://localhost:8000',
        provider_ng_repeat = 'provider in vmProvider.providers track by provi'+
                             'der.id';

  const new_client_button = element(by.css('.buttons .add')),
        modal_form        = element(by.css('.modal-shadow.modal-form')),

        // Provider form elements
        provider_form      = element(by.css('.modal-shadow.modal-form .provider-form')),
        provider_elements  = element.all(by.repeater(provider_ng_repeat)),
        new_provider_input = element(by.model('vmProvider.newProviderName')),
        add_provider_btn   = element(by.css('.provider-button'));

  beforeEach(() => {
    browser.get(url);
  });

  /* Listing and Viewing providers data */

  it('Should be a list of providers', () => {

    // Open the new client button
    new_client_button.click();

    // The form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // There should be elements
    expect(provider_elements.count()).toBeGreaterThan(0);

    provider_elements.each( provider_element => {

      let input_name    = provider_element.element(by.model('provider.name')),
          input_checked = provider_element.element(by.model('provider.checked')),
          edit_btn      = provider_element.element(by.css('.btn-small-edit')),
          delete_btn    = provider_element.element(by.css('.btn-small-delete')),
          save_btn      = provider_element.element(by.css('.btn-small-save')),
          cancel_btn    = provider_element.element(by.css('.btn-small-cancel'));

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

      // The provider name shouldn't be empty
      input_name.getAttribute('value').then( v => {
        expect(v.length).toBeGreaterThan(0);
      });

      // The new provider input should be displayed
      expect(new_provider_input.isDisplayed()).toBeTruthy();

      // The add provider button should be displayed
      expect(add_provider_btn.isDisplayed()).toBeTruthy();

      // The add provider button should be disabled
      expect(add_provider_btn.isEnabled()).toBeFalsy();
    });
  });

});
