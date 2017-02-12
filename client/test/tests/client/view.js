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

  const clientElements = element.all(by.repeater(ngRepeat));

  beforeEach(() => {
    browser.get(url);
  });

  /* Listing and Viewing client data */

  it(`Should have the proper title (${properTitle})`, () => {
    expect(browser.getTitle()).toEqual(properTitle);
  });

  it('should be a list of clients', () => {

    // There should be elements
    expect(clientElements.count()).toBeGreaterThan(0);

    clientElements.each( clientElement => {
      // let div = clientElement.element(by.css('.row'));

      let name  = clientElement.element(by.binding('client.name')),
          email = clientElement.element(by.binding('client.email')),
          phone = clientElement.element(by.binding('client.phone')),
          providers = clientElement.element(by.binding('client.providers'));

      // Required values should be displayed
      expect(name.isDisplayed()).toBeTruthy();
      expect(email.isDisplayed()).toBeTruthy();
      expect(phone.isDisplayed()).toBeTruthy();
      expect(providers.isDisplayed()).toBeTruthy();

      // Required values should have a value
      name.getText().then( t => expect(t.length).toBeGreaterThan(0));
      email.getText().then( t => expect(t.length).toBeGreaterThan(0));
      phone.getText().then( t => expect(t.length).toBeGreaterThan(0));
    });
  });

  it('The list of clients should support filtering', () => {
    let searchField = element(by.model('vm.searchField')),
        searchWord  = 'Some';

    // Count the amount of rows that contains the searched word
    clientElements.reduce( (accumulator, el) => {
      return el.getText().then( text => {
        return accumulator + (text.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1);
      });
    }, 0).then( amountOfMatchedRows => {

      // There should be elements
      clientElements.count().then( count => {

        // Filter the list by the search word
        searchField.sendKeys(searchWord);

        // The amount of matched rows should be equal to the filtered count of rows
        expect(count).toBeGreaterThan(amountOfMatchedRows);

        // All the elements should have the searchWord in it
        clientElements.each( clientElement => {
          clientElement.getText().then( text => {
            expect(text.toLowerCase().indexOf(searchWord.toLowerCase())).not.toBe(-1);
          });
        });
      });
    });
  });

});
