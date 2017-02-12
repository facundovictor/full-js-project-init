/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Client view tests
 *
 * Refereces:
 *  http://www.protractortest.org/#/api
 *  https://jasmine.github.io/edge/introduction
 *  https://github.com/marak/Faker.js/
 */

'use strict';


// Test description
describe('Client view', () => {

  const url          = 'http://localhost:8000',
        proper_title = 'Client-Providers',
        ng_repeat    = 'client in vm.clients | orderBy : vm.listOrder.column '+
                       ': vm.listOrder.reverse | filter : vm.searchField';

  const client_elements = element.all(by.repeater(ng_repeat));

  beforeEach(() => {
    browser.get(url);
  });

  /* Listing and Viewing client data */

  it(`Should have the proper title (${proper_title})`, () => {
    expect(browser.getTitle()).toEqual(proper_title);
  });

  it('Should be a list of clients', () => {

    // There should be elements
    expect(client_elements.count()).toBeGreaterThan(0);

    client_elements.each( client_element => {
      // let div = client_element.element(by.css('.row'));

      let name      = client_element.element(by.binding('client.name')),
          email     = client_element.element(by.binding('client.email')),
          phone     = client_element.element(by.binding('client.phone')),
          providers = client_element.element(by.binding('client.providers'));

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
    let search_field = element(by.model('vm.searchField')),
        search_word  = 'Some';

    // Count the amount of rows that contains the searched word
    client_elements.reduce( (accumulator, el) => {
      return el.getText().then( text => {
        return accumulator + (text.toLowerCase().indexOf(search_word.toLowerCase()) !== -1);
      });
    }, 0).then( amountOfMatchedRows => {

      // There should be elements
      client_elements.count().then( count => {

        // Filter the list by the search word
        search_field.sendKeys(search_word);

        // The amount of matched rows should be equal to the filtered count of rows
        expect(count).toBeGreaterThan(amountOfMatchedRows);

        // All the elements should have the search_word in it
        client_elements.each( client_element => {
          client_element.getText().then( text => {
            expect(text.toLowerCase().indexOf(search_word.toLowerCase())).not.toBe(-1);
          });
        });
      });
    });
  });

});
