/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client edit tests
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
describe('Client edit', () => {

  const url              = 'http://localhost:8000',
        client_ng_repeat = 'client in vm.clients | orderBy : vm.listOrder.col'+
                           'umn : vm.listOrder.reverse | filter : vm.searchFi'+
                           'eld',
        provider_ng_repeat = 'provider in vmProvider.providers track by provi'+
                             'der.id';

  const client_elements   = element.all(by.repeater(client_ng_repeat)),
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

  /* EDITION */

  it('EDITION: Each list row should be editable', () => {
    client_elements.each( client_element => {
      let edit = client_element.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit.isDisplayed()).toBeTruthy();
    });
  });

  it('EDITION: Clicking on client "Edit" should open a client form filled with the client data', () => {
    client_elements.count().then( count => {
      let random_index  = Math.floor(Math.random() * count),
          client_row    = client_elements.get(random_index),
          name_cell     = client_row.element(by.binding('client.name')),
          email_cell    = client_row.element(by.binding('client.email')),
          phone_cell    = client_row.element(by.binding('client.phone')),
          provider_cell = client_row.element(by.binding('client.providers')),
          edit_button   = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

      // The modal form should be visible
      expect(modal_form.isDisplayed()).toBeTruthy();

      // The cancel button should be displayed
      expect(cancel_button.isDisplayed()).toBeTruthy();

      // The delete button should be displayed
      expect(delete_button.isDisplayed()).toBeTruthy();

      // The save button should be displayed
      expect(save_btn.isDisplayed()).toBeTruthy();

      // The save button shouldn't be enabled if the form isn't modified
      expect(save_btn.isEnabled()).toBeFalsy();

      // The name field and input should be displayed
      expect(name_field.isDisplayed()).toBeTruthy();
      expect(name_input.isDisplayed()).toBeTruthy();

      // The email field and input should be displayed
      expect(email_field.isDisplayed()).toBeTruthy();
      expect(email_input.isDisplayed()).toBeTruthy();

      // The phone field and input should be displayed
      expect(phone_field.isDisplayed()).toBeTruthy();
      expect(phone_input.isDisplayed()).toBeTruthy();

      // The provider sub-form should be visible
      expect(provider_form.isDisplayed()).toBeTruthy();

      // The form should be filled with the client data
      name_cell.getText().then( name => {
        email_cell.getText().then( email => {
          phone_cell.getText().then( phone => {
            provider_cell.getText().then( text => {
              let listed_providers = text.split(', ');

              // The proper name should be loaded
              expect(name_input.getAttribute('value')).toBe(name);

              // The proper email should be loaded
              expect(email_input.getAttribute('value')).toBe(email);

              // The proper phone should be loaded
              expect(phone_input.getAttribute('value')).toBe(phone);

              // Only the providers listed on the row should be checked
              provider_elements.each( el => {
                const input_name     = el.element(by.model('provider.name')),
                      input_checkbox = el.element(by.model('provider.checked'));

                input_name.getAttribute('value').then( value => {
                  if (listed_providers.includes(value))
                    expect(input_checkbox.isSelected()).toBeTruthy();
                  else
                    expect(input_checkbox.isSelected()).toBeFalsy();
                });
              });
            });
          });
        });
      });
    });
  });

  it('EDITION: Clicking on "Cancel" should close the edit form', () => {
    client_elements.count().then( count => {
      let random_index  = Math.floor(Math.random() * count),
          client_row    = client_elements.get(random_index),
          edit_button   = client_row.element(by.css('.cell-small a')),
          cancel_button = modal_form.element(by.css('.btn-cancel'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

      // The modal form should be visible
      expect(modal_form.isDisplayed()).toBeTruthy();

      // The cancel button should be displayed
      expect(cancel_button.isDisplayed()).toBeTruthy();

      // Close the form
      cancel_button.click();

      // The modal form shouldn't be visible
      expect(modal_form.isDisplayed()).toBeFalsy();
    });
  });

  it('EDITION: Setting a wrong name should mark the input as invalid', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      name_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
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
  });

  it('EDITION: Editing the name should update the row', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      name_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
      });

      // Set the new value
      name_input.clear().sendKeys(new_name);

      // The current value should match the new value
      expect(name_input.getAttribute('value')).toBe(new_name);

      // The new value should be valid
      expect(name_input.getAttribute('class')).not.toContain('ng-invalid');

      // The save button shouldn't be enabled if the form isn't valid
      expect(save_btn.isEnabled()).toBeTruthy();

      // Save the client and close the form
      save_btn.click();

      // The modal form shouldn't be visible
      expect(modal_form.isDisplayed()).toBeFalsy();

      // The list should be updated and sorted with the new name, but it must
      // be present.
      client_elements.reduce( (isPresent, row) => {
        const name_cell = row.element(by.binding('client.name'));
        return name_cell.getText().then( text => {
          return isPresent || (text === new_name);
        });
      }, 0).then( isPresent => expect(isPresent).toBeTruthy() );
    });
  });

  it('EDITION: Setting an empty email should mark the input as invalid', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      email_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
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
  });

  it('EDITION: Setting a wrong email should mark the input as invalid', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      email_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
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
  });

  it('EDITION: Editing the email should update the row', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      email_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
      });

      // Set the new value
      email_input.clear().sendKeys(new_email);

      // The current value should match the new value
      expect(email_input.getAttribute('value')).toBe(new_email);

      // The new value should be valid
      expect(email_input.getAttribute('class')).not.toContain('ng-invalid');

      // The save button shouldn't be enabled if the form isn't valid
      expect(save_btn.isEnabled()).toBeTruthy();

      // Save the client and close the form
      save_btn.click();

      // The modal form shouldn't be visible
      expect(modal_form.isDisplayed()).toBeFalsy();

      // The list should be updated and sorted with the new email, but it must
      // be present.
      client_elements.reduce( (isPresent, row) => {
        const email_cell = row.element(by.binding('client.email'));
        return email_cell.getText().then( text => {
          return isPresent || (text === new_email);
        });
      }, 0).then( isPresent => expect(isPresent).toBeTruthy() );
    });
  });

  it('EDITION: Setting an empty phone should mark the input as invalid', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      phone_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
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
  });

  it('EDITION: Setting a wrong phone should mark the input as invalid', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      phone_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
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
  });

  it('EDITION: Editing the phone should update the row', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

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

      // The current value shouldn't be empty
      phone_input.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
      });

      // Set the new value
      phone_input.clear().sendKeys(new_phone);

      // The current value should match the new value
      expect(phone_input.getAttribute('value')).toBe(new_phone);

      // The new value should be valid
      expect(phone_input.getAttribute('class')).not.toContain('ng-invalid');

      // The save button shouldn't be enabled if the form isn't valid
      expect(save_btn.isEnabled()).toBeTruthy();

      // Save the client and close the form
      save_btn.click();

      // The modal form shouldn't be visible
      expect(modal_form.isDisplayed()).toBeFalsy();

      // The list should be updated and sorted with the new phone, but it must
      // be present.
      client_elements.reduce( (isPresent, row) => {
        const phone_cell = row.element(by.binding('client.phone'));
        return phone_cell.getText().then( text => {
          return isPresent || (text === new_phone);
        });
      }, false).then( isPresent => expect(isPresent).toBeTruthy() );
    });
  });

  it('EDITION: Editing the checked properties should update the row', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

      // The modal form should be visible
      expect(modal_form.isDisplayed()).toBeTruthy();

      // The save button should be displayed
      expect(save_btn.isDisplayed()).toBeTruthy();

      // The save button shouldn't be enabled if the form isn't modified
      expect(save_btn.isEnabled()).toBeFalsy();

      // The provider sub-form should be visible
      expect(provider_form.isDisplayed()).toBeTruthy();

      // Change the provider checkboxes and return a list of statuses
      provider_elements.map( provider => {
        let checkbox   = provider.element(by.model('provider.checked')),
            name_input = provider.element(by.model('provider.name')),
            change_it  = (Math.random() >= 0.5);

        // Change the checkbox status if apply
        if (change_it)
          checkbox.click();

        return {
          name    : name_input.getAttribute('value'),
          checked : checkbox.isSelected(),
          changed : change_it
        };
      }).then( providers => {

        // Recover if there was a change in the selected providers
        let changed = providers.reduce((changed, provider) => {
          return changed || provider.changed;
        }, false);

        if (changed) {
          // The save button should be enabled if there was changes
          expect(save_btn.isEnabled()).toBeTruthy();

          // Save the changes and close the form
          save_btn.click();

          // The modal form shouldn't be visible
          expect(modal_form.isDisplayed()).toBeFalsy();

          // The list should be a list containing the checked providers
          client_elements.reduce( (isPresent, row) => {
            const provider_cell = row.element(by.binding('client.providers | providerListOfNamesFilter'));
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

              return isPresent || found;
            });
          }, false).then( isPresent => expect(isPresent).toBeTruthy() );
        }
      });
    });
  });
});
