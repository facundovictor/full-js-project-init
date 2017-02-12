/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client creation tests
 */

'use strict';

const faker = require('faker');

describe('Client add', () => {

  const url              = 'http://localhost:8000',
        client_ng_repeat = 'client in vm.clients | orderBy : vm.listOrder.col'+
                           'umn : vm.listOrder.reverse | filter : vm.searchFi'+
                           'eld',
        provider_ng_repeat = 'provider in vmProvider.providers track by provi'+
                             'der.id';

  const client_elements   = element.all(by.repeater(client_ng_repeat)),
        new_client_button = element(by.css('.buttons .add')),
        modal_form        = element(by.css('.modal-shadow.modal-form')),

        // Modal form inner elements
        modal_form_fields = element.all(by.repeater('field in vm.form.fields')),
        save_btn          = modal_form.element(by.css('.btn-save')),
        cancel_button     = modal_form.element(by.css('.btn-cancel')),
        delete_button     = modal_form.element(by.css('.btn-delete')),
        name_field        = modal_form_fields.first(),
        name_input        = name_field.element(by.model('field.value')),
        email_field       = modal_form_fields.get(1),
        email_input       = email_field.element(by.model('field.value')),
        phone_field       = modal_form_fields.get(2),
        phone_input       = phone_field.element(by.model('field.value')),

        // Provider form elements
        provider_form     = element(by.css('.modal-shadow.modal-form .provider-form')),
        provider_elements = element.all(by.repeater(provider_ng_repeat));

  const new_name    = faker.name.findName('Protractor').substr(0, 50),
        new_email   = faker.internet.email('protractor').substr(0, 50),
        new_phone   = faker.phone.phoneNumberFormat(), // Format : XXX-XXX-XXXX
        wrong_phone = faker.phone.phoneNumberFormat(1),
        wrong_email = 'wrong.email@com@wrong.domain@wrong!',
        wrong_name  = "",
        empty_email = "",
        empty_phone = '';

  beforeEach(() => {
    browser.get(url);
  });

  /* CREATION */

  it('CREATION: Clicking on "New Client" should open a new empty form', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The cancel button should be displayed
    expect(cancel_button.isDisplayed()).toBeTruthy();

    // The delete button shouldn't be displayed
    expect(delete_button.isDisplayed()).toBeFalsy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // Validate the fields
    modal_form_fields.each( field => {
      let input = field.element(by.model('field.value'));

      // The field should be displayed
      expect(field.isDisplayed()).toBeTruthy();
      expect(input.isDisplayed()).toBeTruthy();

      // The field should be empty (New client mode)
      input.getAttribute('value').then( value => expect(value.length).toBe(0) );
    });

    // The provider sub-form should be visible
    expect(provider_form.isDisplayed()).toBeTruthy();
  });

  it('CREATION: Clicking on "Cancel" should close the form', () => {
    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The cancel button should be displayed
    expect(cancel_button.isDisplayed()).toBeTruthy();

    // Close the form
    cancel_button.click();

    // The modal form shouldn't be visible
    expect(modal_form.isDisplayed()).toBeFalsy();
  });

  it('CREATION: Setting a wrong name should mark the input as invalid', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the name field
    name_field.getText().then( text => expect(text.toLowerCase()).toContain('name') );

    // The current value should be empty
    name_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    name_input.clear().sendKeys(wrong_name);

    // The current value should match the new value
    expect(name_input.getAttribute('value')).toBe(wrong_name);

    // The new value should be valid
    expect(name_input.getAttribute('class')).toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't valid
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it("CREATION: Setting a correct name shouldn't mark it as invalid", () => {
    let new_name = 'New name (from protractor)';

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the name field
    name_field.getText().then( text => expect(text.toLowerCase()).toContain('name') );

    // The current value should be empty
    name_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    name_input.clear().sendKeys(new_name);

    // The current value should match the new value
    expect(name_input.getAttribute('value')).toBe(new_name);

    // The new value should be valid
    expect(name_input.getAttribute('class')).not.toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't filled (ie: valid)
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it('CREATION: Setting an empty email should mark the input as invalid', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the email field
    email_field.getText().then( text => expect(text.toLowerCase()).toContain('email') );

    // The current value should be empty
    email_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    email_input.clear().sendKeys(empty_email);

    // The current value should match the new value
    expect(email_input.getAttribute('value')).toBe(empty_email);

    // The new value should be valid
    expect(email_input.getAttribute('class')).toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't valid
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it('CREATION: Setting a wrong email should mark the input as invalid', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the email field
    email_field.getText().then( text => expect(text.toLowerCase()).toContain('email') );

    // The current value should be empty
    email_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    email_input.clear().sendKeys(wrong_email);

    // The current value should match the new value
    expect(email_input.getAttribute('value')).toBe(wrong_email);

    // The new value should be valid
    expect(email_input.getAttribute('class')).toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't valid
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it("CREATION: Setting a correct email shouldn't mark it as invalid", () => {
    let new_email = 'protractor_test@email.com';

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the email field
    email_field.getText().then( text => expect(text.toLowerCase()).toContain('email') );

    // The current value should be empty
    email_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    email_input.clear().sendKeys(new_email);

    // The current value should match the new value
    expect(email_input.getAttribute('value')).toBe(new_email);

    // The new value should be valid
    expect(email_input.getAttribute('class')).not.toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't filled (ie: valid)
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it('CREATION: Setting an empty phone should mark the input as invalid', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the phone field
    phone_field.getText().then( text => expect(text.toLowerCase()).toContain('phone') );

    // The current value should be empty
    phone_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    phone_input.clear().sendKeys(empty_phone);

    // The current value should match the new value
    expect(phone_input.getAttribute('value')).toBe(empty_phone);

    // The new value should be valid
    expect(phone_input.getAttribute('class')).toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't valid
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it('CREATION: Setting a wrong phone should mark the input as invalid', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the phone field
    phone_field.getText().then( text => expect(text.toLowerCase()).toContain('phone') );

    // The current value should be empty
    phone_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    phone_input.clear().sendKeys(wrong_phone);

    // The current value should match the new value
    expect(phone_input.getAttribute('value')).toBe(wrong_phone);

    // The new value should be valid
    expect(phone_input.getAttribute('class')).toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't valid
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it("CREATION: Setting a correct phone shouldn't mark it as invalid", () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the phone field
    phone_field.getText().then( text => expect(text.toLowerCase()).toContain('phone') );

    // The current value should be empty
    phone_input.getAttribute('value').then( value => {
      expect(value.length).toBe(0);
    });

    // Set the new value
    phone_input.clear().sendKeys(new_phone);

    // The current value should match the new value
    expect(phone_input.getAttribute('value')).toBe(new_phone);

    // The new value should be valid
    expect(phone_input.getAttribute('class')).not.toContain('ng-invalid');

    // The save button shouldn't be enabled if the form isn't filled (ie: valid)
    expect(save_btn.isEnabled()).toBeFalsy();
  });

  it('CREATION: Setting a proper name, email and phone should enable saving', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the proper ones
    name_field.getText().then( text => expect(text.toLowerCase()).toContain('name') );
    phone_field.getText().then( text => expect(text.toLowerCase()).toContain('phone') );
    email_field.getText().then( text => expect(text.toLowerCase()).toContain('email') );

    // The current values should be empty
    name_input.getAttribute('value').then( v => expect(v.length).toBe(0) );
    email_input.getAttribute('value').then( v => expect(v.length).toBe(0) );
    phone_input.getAttribute('value').then( v => expect(v.length).toBe(0) );

    // Set the new values
    name_input.clear().sendKeys(new_name);
    email_input.clear().sendKeys(new_email);
    phone_input.clear().sendKeys(new_phone);

    // The current values should match the new values
    expect(name_input.getAttribute('value')).toBe(new_name);
    expect(email_input.getAttribute('value')).toBe(new_email);
    expect(phone_input.getAttribute('value')).toBe(new_phone);

    // The new values should be valid
    expect(name_input.getAttribute('class')).not.toContain('ng-invalid');
    expect(email_input.getAttribute('class')).not.toContain('ng-invalid');
    expect(phone_input.getAttribute('class')).not.toContain('ng-invalid');

    // The save button should be enabled
    expect(save_btn.isEnabled()).toBeTruthy();
  });

  it('CREATION: Saving a new client should update the list with the new data', () => {

    // The button should be available
    expect(new_client_button.isDisplayed()).toBeTruthy();

    // Open the new client modal form
    new_client_button.click();

    // The modal form should be visible
    expect(modal_form.isDisplayed()).toBeTruthy();

    // The save button should be displayed
    expect(save_btn.isDisplayed()).toBeTruthy();

    // The save button shouldn't be enabled if the form isn't modified
    expect(save_btn.isEnabled()).toBeFalsy();

    // the modal form should have 3 fields
    expect(modal_form_fields.count()).toBe(3);

    // The field should be the proper ones
    name_field.getText().then( text => expect(text.toLowerCase()).toContain('name') );
    phone_field.getText().then( text => expect(text.toLowerCase()).toContain('phone') );
    email_field.getText().then( text => expect(text.toLowerCase()).toContain('email') );

    // The current values should be empty
    name_input.getAttribute('value').then( v => expect(v.length).toBe(0) );
    email_input.getAttribute('value').then( v => expect(v.length).toBe(0) );
    phone_input.getAttribute('value').then( v => expect(v.length).toBe(0) );

    // Set the new values
    name_input.clear().sendKeys(new_name);
    email_input.clear().sendKeys(new_email);
    phone_input.clear().sendKeys(new_phone);

    // The current values should match the new values
    expect(name_input.getAttribute('value')).toBe(new_name);
    expect(email_input.getAttribute('value')).toBe(new_email);
    expect(phone_input.getAttribute('value')).toBe(new_phone);

    // The new values should be valid
    expect(name_input.getAttribute('class')).not.toContain('ng-invalid');
    expect(email_input.getAttribute('class')).not.toContain('ng-invalid');
    expect(phone_input.getAttribute('class')).not.toContain('ng-invalid');

    // The save button should be enabled
    expect(save_btn.isEnabled()).toBeTruthy();

    // Randomly select some providers
    provider_elements.map( provider => {
      let checkbox   = provider.element(by.model('provider.checked')),
          name_input = provider.element(by.model('provider.name')),
          change_it  = (Math.random() >= 0.5);

      // Change the checkbox status if apply
      if (change_it)
        checkbox.click();

      return {
        name    : name_input.getAttribute('value'),
        checked : checkbox.isSelected()
      };
    }).then( providers => {
      client_elements.count().then( count => {

        // Save the new form
        save_btn.click();

        // The modal form shouldn't be visible
        expect(modal_form.isDisplayed()).toBeFalsy();

        // There should be a new row
        expect(client_elements.count()).toBe( count + 1 );

        // The list should contain a row with the new data
        client_elements.reduce( (isPresent, row) => {
          const provider_cell = row.element(by.binding('client.providers | providerListOfNamesFilter')),
                name_cell     = row.element(by.binding('client.name')),
                email_cell    = row.element(by.binding('client.email')),
                phone_cell    = row.element(by.binding('client.phone'));
          
          return name_cell.getText().then( name => {
            return email_cell.getText().then( email => {
              return phone_cell.getText().then( phone => {
                
                return provider_cell.getText().then( text => {
                    let listed_providers = text.split(', ');

                    // Check if all the providers are present only if checked
                    let found = providers.reduce(( found, provider ) => {
                        let contained = listed_providers.indexOf(provider.name) !== -1;

                        if (provider.checked)
                            return found && contained;
                        else
                            return found && !contained;
                    }, true);

                    // The row is found if all the fields matches
                    found = found                &&
                            name   === new_name  &&
                            email  === new_email &&
                            phone  === new_phone;

                    return isPresent || found;
                });

              });
            });
          });

        }, false).then( isPresent => expect(isPresent).toBeTruthy() );
      });
    });
  });

});
