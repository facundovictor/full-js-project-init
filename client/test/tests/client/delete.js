/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client delete tests
 */

'use strict';

describe('Client deletion', () => {

  const url      = 'http://localhost:8000',
        ngRepeat = 'client in vm.clients | orderBy : vm.listOrder.column '+
                   ': vm.listOrder.reverse | filter : vm.searchField';

  const client_elements = element.all(by.repeater(ngRepeat)),
        modal_form      = element(by.css('.modal-shadow.modal-form'));

  beforeEach(() => {
    browser.get(url);
  });


  /* DELETION */

  it('DELETION: Each list row should be removable', () => {
    client_elements.each( client_element => {
      let del = client_element.element(by.css('.cell-small i'));

      // The buttons should be displayed
      expect(del.isDisplayed()).toBeTruthy();
    });
  });

  it('DELETION: When removing a client, the list should be updated', () => {

    client_elements.count().then( count => {

      // There should exist a row for testing deletion
      if (count) {
        let random_index = Math.floor(Math.random() * count),
            client_row   = client_elements.get(random_index),
            del_button   = client_row.element(by.css('.cell-small i'));

        // Filter the list by the search word
        del_button.click();

        // The row count should be the same minus 1
        expect(client_elements.count()).toBe( count - 1 );
      }
    });
  });

  /* DELETION from the EDITION form */

  it('DELETION: Tapping on "Delete" should close the form and update the list', () => {
    client_elements.count().then( count => {
      let random_index = Math.floor(Math.random() * count),
          client_row   = client_elements.get(random_index),
          edit_button  = client_row.element(by.css('.cell-small a')),
          del_button   = modal_form.element(by.css('.btn-delete'));

      // The buttons should be displayed
      expect(edit_button.isDisplayed()).toBeTruthy();

      // Open the new client modal form
      edit_button.click();

      // The modal form should be visible
      expect(modal_form.isDisplayed()).toBeTruthy();

      // The delete button should be displayed
      expect(del_button.isDisplayed()).toBeTruthy();

      // Delete the client and close the form
      del_button.click();

      // The modal form shouldn't be visible
      expect(modal_form.isDisplayed()).toBeFalsy();

      // The row counts should be decreased by 1
      expect(client_elements.count()).toBe( count - 1 );
    });
  });

});
