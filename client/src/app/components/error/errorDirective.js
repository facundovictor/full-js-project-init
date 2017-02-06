/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Simple and generic modal error.
 */

app.directive('error', function(){
  return {
    restrict     : 'E',
    templateUrl  : 'components/error/errorView.html',
    transclude   : true,
    replace      : true,
    scope        : false,
    controller   : 'errorController',
    controllerAs : 'error'
  };
});
