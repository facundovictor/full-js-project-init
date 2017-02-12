/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client view tests
 */

'use strict';

describe('client screen', () => {

  const url         = 'http://localhost:8000',
        properTitle = 'Client-Providers',
        ngRepeat    = 'client in vm.clients | orderBy : vm.listOrder.column '+
                      ': vm.listOrder.reverse | filter : vm.searchField';

  const clientElements  = element.all(by.repeater(ngRepeat)),
        modalForm       = element(by.css('.modal-shadow.modal-form')),
        modalFormFields = element.all(by.repeater('field in vm.form.fields')),
        providerForm    = element(by.css('.modal-shadow.modal-form .provider-form'));

  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
    browser.get(url);
  });

  /* Listing and Viewing client data */

  // it(`Should have the proper title (${properTitle})`, () => {
  //   expect(browser.getTitle()).toEqual(properTitle);
  // });
  //
  // it('should be a list of clients', () => {
  //
  //   // There should be elements
  //   expect(clientElements.count()).toBeGreaterThan(0);
  //
  //   clientElements.each( clientElement => {
  //     // let div = clientElement.element(by.css('.row'));
  //
  //     let name  = clientElement.element(by.binding('client.name')),
  //         email = clientElement.element(by.binding('client.email')),
  //         phone = clientElement.element(by.binding('client.phone')),
  //         providers = clientElement.element(by.binding('client.providers'));
  //
  //     // Required values should be displayed
  //     expect(name.isDisplayed()).toBeTruthy();
  //     expect(email.isDisplayed()).toBeTruthy();
  //     expect(phone.isDisplayed()).toBeTruthy();
  //     expect(providers.isDisplayed()).toBeTruthy();
  //
  //     // Required values should have a value
  //     name.getText().then( t => expect(t.length).toBeGreaterThan(0));
  //     email.getText().then( t => expect(t.length).toBeGreaterThan(0));
  //     phone.getText().then( t => expect(t.length).toBeGreaterThan(0));
  //   });
  // });

  // it('The list of clients should support filtering', () => {
  //   let searchField = element(by.model('vm.searchField')),
  //       searchWord  = 'Some';
  //
  //   // Count the amount of rows that contains the searched word
  //   clientElements.reduce( (accumulator, el) => {
  //     return el.getText().then( text => {
  //       return accumulator + (text.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1);
  //     });
  //   }, 0).then( amountOfMatchedRows => {
  //
  //     // There should be elements
  //     clientElements.count().then( count => {
  //
  //       // Filter the list by the search word
  //       searchField.sendKeys(searchWord);
  //
  //       // The amount of matched rows should be equal to the filtered count of rows
  //       expect(count).toBeGreaterThan(amountOfMatchedRows);
  //
  //       // All the elements should have the searchWord in it
  //       clientElements.each( clientElement => {
  //         clientElement.getText().then( text => {
  //           expect(text.toLowerCase().indexOf(searchWord.toLowerCase())).not.toBe(-1);
  //         });
  //       });
  //     });
  //   });
  // });

  /* DELETION */

  // it('DELETION: Each list row should be removable', () => {
  //   clientElements.each( clientElement => {
  //     let del = clientElement.element(by.css('.cell-small i'));
  //
  //     // The buttons should be displayed
  //     expect(del.isDisplayed()).toBeTruthy();
  //   });
  // });

  // it('DELETION: When removing a client, the list should be updated', () => {
  //
  //   clientElements.count().then( count => {
  //
  //     // There should exist a row for testing deletion
  //     if (count) {
  //       let random_client_index = Math.floor(Math.random() * count),
  //           random_client_row   = clientElements.get(random_client_index),
  //           delButton           = random_client_row.element(by.css('.cell-small i'));
  //
  //       // Filter the list by the search word
  //       delButton.click();
  //
  //       // The row count should be the same minus 1
  //       expect(clientElements.count()).toBe( count - 1 );
  //     }
  //   });
  // });

  /* EDITION */

  // it('EDITION: Each list row should be editable', () => {
  //   clientElements.each( clientElement => {
  //     let edit = clientElement.element(by.css('.cell-small a'));
  //
  //     // The buttons should be displayed
  //     expect(edit.isDisplayed()).toBeTruthy();
  //   });
  // });
  //
  // it('EDITION: Clicking on "Edit" should open a client form filled with data', () => {
  //   clientElements.count().then( count => {
  //     let random_client_index = Math.floor(Math.random() * count),
  //         random_client_row   = clientElements.get(random_client_index),
  //         editButton          = random_client_row.element(by.css('.cell-small a')),
  //         saveButton          = modalForm.element(by.css('.btn-save')),
  //         cancelButton        = modalForm.element(by.css('.btn-cancel')),
  //         deleteButton        = modalForm.element(by.css('.btn-delete'));
  //
  //     // The buttons should be displayed
  //     expect(editButton.isDisplayed()).toBeTruthy();
  //
  //     // Open the new client modal form
  //     editButton.click();
  //
  //     // The modal form should be visible
  //     expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //     // The cancel button should be displayed
  //     expect(cancelButton.isDisplayed()).toBeTruthy();
  //
  //     // The save button should be displayed
  //     expect(saveButton.isDisplayed()).toBeTruthy();
  //
  //     // The save button shouldn't be enabled if the form isn't modified
  //     expect(saveButton.isEnabled()).toBeFalsy();
  //
  //     // the modal form should have 3 fields
  //     expect(modalFormFields.count()).toBe(3);
  //
  //     // Validate the fields
  //     modalFormFields.each( field => {
  //       let input = field.element(by.model('field.value'));
  //
  //       // The field should be displayed
  //       expect(field.isDisplayed()).toBeTruthy();
  //       expect(input.isDisplayed()).toBeTruthy();
  //
  //       // The field should be empty (New client mode)
  //       input.getAttribute('value').then( value => {
  //         expect(value.length).toBeGreaterThan(0);
  //       });
  //     });
  //
  //     // The provider sub-form should be visible
  //     expect(providerForm.isDisplayed()).toBeTruthy();
  //   });
  // });

  // it('EDITION: Tapping on "Cancel" should close the edit form', () => {
  //   clientElements.count().then( count => {
  //     let random_client_index = Math.floor(Math.random() * count),
  //         random_client_row   = clientElements.get(random_client_index),
  //         editButton          = random_client_row.element(by.css('.cell-small a')),
  //         cancelButton        = modalForm.element(by.css('.btn-cancel'));
  //
  //     // The buttons should be displayed
  //     expect(editButton.isDisplayed()).toBeTruthy();
  //
  //     // Open the new client modal form
  //     editButton.click();
  //
  //     // The modal form should be visible
  //     expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //     // The cancel button should be displayed
  //     expect(cancelButton.isDisplayed()).toBeTruthy();
  //
  //     // Close the form
  //     cancelButton.click();
  //
  //     // The modal form shouldn't be visible
  //     expect(modalForm.isDisplayed()).toBeFalsy();
  //   });
  // });

  // it('DELETION: Tapping on "Delete" should close the form and update the list', () => {
  //   clientElements.count().then( count => {
  //     let random_client_index = Math.floor(Math.random() * count),
  //         random_client_row   = clientElements.get(random_client_index),
  //         editButton          = random_client_row.element(by.css('.cell-small a')),
  //         deleteButton        = modalForm.element(by.css('.btn-delete'));
  //
  //     // The buttons should be displayed
  //     expect(editButton.isDisplayed()).toBeTruthy();
  //
  //     // Open the new client modal form
  //     editButton.click();
  //
  //     // The modal form should be visible
  //     expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //     // The delete button should be displayed
  //     expect(deleteButton.isDisplayed()).toBeTruthy();
  //
  //     // Delete the client and close the form
  //     deleteButton.click();
  //
  //     // The modal form shouldn't be visible
  //     expect(modalForm.isDisplayed()).toBeFalsy();
  //
  //     // The row counts should be decreased by 1
  //     expect(clientElements.count()).toBe( count - 1 );
  //   });
  // });

  // it('EDITION: Setting a wrong name should mark the input as invalid', () => {
  //   clientElements.count().then( count => {
  //     let random_client_index = Math.floor(Math.random() * count),
  //         random_client_row   = clientElements.get(random_client_index),
  //         nameCell            = random_client_row.element(by.binding('client.name')),
  //         editButton          = random_client_row.element(by.css('.cell-small a')),
  //         saveButton          = modalForm.element(by.css('.btn-save')),
  //         nameField           = modalFormFields.first(),
  //         nameInput           = nameField.element(by.model('field.value')),
  //         wrongName           = "";
  //
  //     // The buttons should be displayed
  //     expect(editButton.isDisplayed()).toBeTruthy();
  //
  //     // Open the new client modal form
  //     editButton.click();
  //
  //     // The modal form should be visible
  //     expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //     // The save button should be displayed
  //     expect(saveButton.isDisplayed()).toBeTruthy();
  //
  //     // The save button shouldn't be enabled if the form isn't modified
  //     expect(saveButton.isEnabled()).toBeFalsy();
  //
  //     // the modal form should have 3 fields
  //     expect(modalFormFields.count()).toBe(3);
  //
  //     // The field should be the name field
  //     nameField.getText().then( text => expect(text.toLowerCase()).toContain('name') );
  //
  //     // The current value shouldn't be empty
  //     nameInput.getAttribute('value').then( value => {
  //       expect(value.length).toBeGreaterThan(0);
  //     });
  //
  //     // Set the new value
  //     nameInput.clear().sendKeys(wrongName);
  //
  //     // The current value should match the new value
  //     expect(nameInput.getAttribute('value')).toBe(wrongName);
  //
  //     // The new value should be valid
  //     expect(nameInput.getAttribute('class')).toContain('ng-invalid');
  //
  //     // The save button shouldn't be enabled if the form isn't valid
  //     expect(saveButton.isEnabled()).toBeFalsy();
  //   });
  // });

  // it('EDITION: Editing the name should update the row', () => {
  //   clientElements.count().then( count => {
  //     let random_client_index = Math.floor(Math.random() * count),
  //         random_client_row   = clientElements.get(random_client_index),
  //         editButton          = random_client_row.element(by.css('.cell-small a')),
  //         saveButton          = modalForm.element(by.css('.btn-save')),
  //         nameField           = modalFormFields.first(),
  //         nameInput           = nameField.element(by.model('field.value')),
  //         newName             = `New name ${random_client_index} (from protractor)`;
  //
  //     // The buttons should be displayed
  //     expect(editButton.isDisplayed()).toBeTruthy();
  //
  //     // Open the new client modal form
  //     editButton.click();
  //
  //     // The modal form should be visible
  //     expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //     // The save button should be displayed
  //     expect(saveButton.isDisplayed()).toBeTruthy();
  //
  //     // The save button shouldn't be enabled if the form isn't modified
  //     expect(saveButton.isEnabled()).toBeFalsy();
  //
  //     // the modal form should have 3 fields
  //     expect(modalFormFields.count()).toBe(3);
  //
  //     // The field should be the name field
  //     nameField.getText().then( text => expect(text.toLowerCase()).toContain('name') );
  //
  //     // The current value shouldn't be empty
  //     nameInput.getAttribute('value').then( value => {
  //       expect(value.length).toBeGreaterThan(0);
  //     });
  //
  //     // Set the new value
  //     nameInput.clear().sendKeys(newName);
  //
  //     // The current value should match the new value
  //     expect(nameInput.getAttribute('value')).toBe(newName);
  //
  //     // The new value should be valid
  //     expect(nameInput.getAttribute('class')).not.toContain('ng-invalid');
  //
  //     // The save button shouldn't be enabled if the form isn't valid
  //     expect(saveButton.isEnabled()).toBeTruthy();
  //
  //     // Save the client and close the form
  //     saveButton.click();
  //
  //     // The modal form shouldn't be visible
  //     expect(modalForm.isDisplayed()).toBeFalsy();
  //
  //     // The list should be updated and sorted with the new name, but it must
  //     // be present.
  //     clientElements.reduce( (isPresent, row) => {
  //       const nameCell = row.element(by.binding('client.name'));
  //       return nameCell.getText().then( text => {
  //         return isPresent || (text === newName);
  //       });
  //     }, 0).then( isPresent => expect(isPresent).toBeTruthy() );
  //   });
  // });

  it('EDITION: Setting an empty email should mark the input as invalid', () => {
    clientElements.count().then( count => {
      let random_client_index = Math.floor(Math.random() * count),
          random_client_row   = clientElements.get(random_client_index),
          emailCell           = random_client_row.element(by.binding('client.email')),
          editButton          = random_client_row.element(by.css('.cell-small a')),
          saveButton          = modalForm.element(by.css('.btn-save')),
          emailField          = modalFormFields.get(1),
          emailInput          = emailField.element(by.model('field.value')),
          emptyEmail          = "";

      // The buttons should be displayed
      expect(editButton.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      editButton.click();

      // The modal form should be visible
      expect(modalForm.isDisplayed()).toBeTruthy();

      // The save button should be displayed
      expect(saveButton.isDisplayed()).toBeTruthy();

      // The save button shouldn't be enabled if the form isn't modified
      expect(saveButton.isEnabled()).toBeFalsy();

      // the modal form should have 3 fields
      expect(modalFormFields.count()).toBe(3);

      // The field should be the email field
      emailField.getText().then( text => expect(text.toLowerCase()).toContain('email') );

      // The current value shouldn't be empty
      emailInput.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
      });

      // Set the new value
      emailInput.clear().sendKeys(emptyEmail);

      // The current value should match the new value
      expect(emailInput.getAttribute('value')).toBe(emptyEmail);

      // The new value should be valid
      expect(emailInput.getAttribute('class')).toContain('ng-invalid');

      // The save button shouldn't be enabled if the form isn't valid
      expect(saveButton.isEnabled()).toBeFalsy();
    });
  });

  it('EDITION: Setting a wrong email should mark the input as invalid', () => {
    clientElements.count().then( count => {
      let random_client_index = Math.floor(Math.random() * count),
          random_client_row   = clientElements.get(random_client_index),
          emailCell           = random_client_row.element(by.binding('client.email')),
          editButton          = random_client_row.element(by.css('.cell-small a')),
          saveButton          = modalForm.element(by.css('.btn-save')),
          emailField          = modalFormFields.get(1),
          emailInput          = emailField.element(by.model('field.value')),
          wrongEmail          = "wrong.email@com@wrong.domain@wrong!";

      // The buttons should be displayed
      expect(editButton.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      editButton.click();

      // The modal form should be visible
      expect(modalForm.isDisplayed()).toBeTruthy();

      // The save button should be displayed
      expect(saveButton.isDisplayed()).toBeTruthy();

      // The save button shouldn't be enabled if the form isn't modified
      expect(saveButton.isEnabled()).toBeFalsy();

      // the modal form should have 3 fields
      expect(modalFormFields.count()).toBe(3);

      // The field should be the email field
      emailField.getText().then( text => expect(text.toLowerCase()).toContain('email') );

      // The current value shouldn't be empty
      emailInput.getAttribute('value').then( value => {
        expect(value.length).toBeGreaterThan(0);
      });

      // Set the new value
      emailInput.clear().sendKeys(wrongEmail);

      // The current value should match the new value
      expect(emailInput.getAttribute('value')).toBe(wrongEmail);

      // The new value should be valid
      expect(emailInput.getAttribute('class')).toContain('ng-invalid');

      // The save button shouldn't be enabled if the form isn't valid
      expect(saveButton.isEnabled()).toBeFalsy();
    });
  });

  // it('EDITION: Editing the email should update the row', () => {
  //   clientElements.count().then( count => {
  //     let random_client_index = Math.floor(Math.random() * count),
  //         random_client_row   = clientElements.get(random_client_index),
  //         editButton          = random_client_row.element(by.css('.cell-small a')),
  //         saveButton          = modalForm.element(by.css('.btn-save')),
  //         emailField          = modalFormFields.get(1),
  //         emailInput          = emailField.element(by.model('field.value')),
  //         newEmail            = `protractor_test_${random_client_index}@email.com`;
  //
  //     // The buttons should be displayed
  //     expect(editButton.isDisplayed()).toBeTruthy();
  //
  //     // Open the new client modal form
  //     editButton.click();
  //
  //     // The modal form should be visible
  //     expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //     // The save button should be displayed
  //     expect(saveButton.isDisplayed()).toBeTruthy();
  //
  //     // The save button shouldn't be enabled if the form isn't modified
  //     expect(saveButton.isEnabled()).toBeFalsy();
  //
  //     // the modal form should have 3 fields
  //     expect(modalFormFields.count()).toBe(3);
  //
  //     // The field should be the email field
  //     emailField.getText().then( text => expect(text.toLowerCase()).toContain('email') );
  //
  //     // The current value shouldn't be empty
  //     emailInput.getAttribute('value').then( value => {
  //       expect(value.length).toBeGreaterThan(0);
  //     });
  //
  //     // Set the new value
  //     emailInput.clear().sendKeys(newEmail);
  //
  //     // The current value should match the new value
  //     expect(emailInput.getAttribute('value')).toBe(newEmail);
  //
  //     // The new value should be valid
  //     expect(emailInput.getAttribute('class')).not.toContain('ng-invalid');
  //
  //     // The save button shouldn't be enabled if the form isn't valid
  //     expect(saveButton.isEnabled()).toBeTruthy();
  //
  //     // Save the client and close the form
  //     saveButton.click();
  //
  //     // The modal form shouldn't be visible
  //     expect(modalForm.isDisplayed()).toBeFalsy();
  //
  //     // The list should be updated and sorted with the new email, but it must
  //     // be present.
  //     clientElements.reduce( (isPresent, row) => {
  //       const emailCell = row.element(by.binding('client.email'));
  //       return emailCell.getText().then( text => {
  //         return isPresent || (text === newEmail);
  //       });
  //     }, 0).then( isPresent => expect(isPresent).toBeTruthy() );
  //   });
  // });



  // it('Clicking on "New Client" should open a new empty client form', () => {
  //   let newClientButton = element(by.css('.buttons .add'));
  //
  //   // The button should be available
  //   expect(newClientButton.isDisplayed()).toBeTruthy();
  //
  //   // Open the new client modal form
  //   newClientButton.click();
  //
  //   // The modal form should be visible
  //   expect(modalForm.isDisplayed()).toBeTruthy();
  //
  //   // the modal form should have 3 fields
  //   expect(modalFormFields.count()).toBe(3);
  //
  //   // Validate the fields
  //   modalFormFields.each( field => {
  //     let input = field.element(by.model('field.value'));
  //
  //     // The field should be displayed
  //     expect(field.isDisplayed()).toBeTruthy();
  //     expect(input.isDisplayed()).toBeTruthy();
  //
  //     // The field should be empty (New client mode)
  //     input.getAttribute('value').then( value => expect(value.length).toBe(0) );
  //   });
  //
  //   // The provider sub-form should be visible
  //   expect(providerForm.isDisplayed()).toBeTruthy();
  // });






      // let cells = clientElement.all(by.css('.row .cell'));
      //
      // cells.each( cell => {
      //   
      //   // Should be displayed
      //   expect(cell.isDisplayed()).toBeTruthy();
      //
      //
      //
      //   // Should have a value
      //   cell.getText().then( text => {
      //     console.log(text);
      //     expect(text.length).toBeGreaterThan(0)
      //   });
      // });

      // let cells = div.element(by.css('.cell'));

      // div.getInnerHtml().then( html => {
      //   console.log(html);
      // });

      // clientElement.each( clientAttr => {
      //   clientAtter.getText().then( text => console.log(text) );
      // });
    // element(by.model('todoList.todoText')).sendKeys('write first protractor test');
    // element(by.css('[value="add"]')).click();

    // var todoList = element.all(by.repeater('todo in todoList.todos'));
    // expect(todoList.count()).toEqual(3);
    // expect(todoList.get(2).getText()).toEqual('write first protractor test');
    //
    // // You wrote your first test, cross it off the list
    // todoList.get(2).element(by.css('input')).click();
    // var completedAmount = element.all(by.css('.done-true'));
    // expect(completedAmount.count()).toEqual(2);
});
