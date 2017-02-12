/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client delete tests
 */

'use strict';

describe('Client deletion', () => {

  const url         = 'http://localhost:8000',
        properTitle = 'Client-Providers',
        ngRepeat    = 'client in vm.clients | orderBy : vm.listOrder.column '+
                      ': vm.listOrder.reverse | filter : vm.searchField';

  const clientElements = element.all(by.repeater(ngRepeat)),
        modalForm      = element(by.css('.modal-shadow.modal-form'));

  beforeEach(() => {
    browser.get(url);
  });


  /* DELETION */

  it('DELETION: Each list row should be removable', () => {
    clientElements.each( clientElement => {
      let del = clientElement.element(by.css('.cell-small i'));

      // The buttons should be displayed
      expect(del.isDisplayed()).toBeTruthy();
    });
  });

  it('DELETION: When removing a client, the list should be updated', () => {

    clientElements.count().then( count => {

      // There should exist a row for testing deletion
      if (count) {
        let random_client_index = Math.floor(Math.random() * count),
            random_client_row   = clientElements.get(random_client_index),
            delButton           = random_client_row.element(by.css('.cell-small i'));

        // Filter the list by the search word
        delButton.click();

        // The row count should be the same minus 1
        expect(clientElements.count()).toBe( count - 1 );
      }
    });
  });

  /* DELETION from the EDITION form */

  it('DELETION: Tapping on "Delete" should close the form and update the list', () => {
    clientElements.count().then( count => {
      let random_client_index = Math.floor(Math.random() * count),
          random_client_row   = clientElements.get(random_client_index),
          editButton          = random_client_row.element(by.css('.cell-small a')),
          deleteButton        = modalForm.element(by.css('.btn-delete'));

      // The buttons should be displayed
      expect(editButton.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      editButton.click();

      // The modal form should be visible
      expect(modalForm.isDisplayed()).toBeTruthy();

      // The delete button should be displayed
      expect(deleteButton.isDisplayed()).toBeTruthy();

      // Delete the client and close the form
      deleteButton.click();

      // The modal form shouldn't be visible
      expect(modalForm.isDisplayed()).toBeFalsy();

      // The row counts should be decreased by 1
      expect(clientElements.count()).toBe( count - 1 );
    });
  });

});
