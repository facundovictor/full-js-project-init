/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Filter to display an array of properties as a list of property names separ
 * -ated by commas.
 */

'use strict';

app.filter('providerListOfNamesFilter', () => {
  return function (providers) {
    return providers.map( provider => {
      return provider.name;
    }).join(', ');
  };
});
