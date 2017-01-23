/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Simple and generic modal error.
 */

app.directive('modalError', function(){
  return {
    restrict    : 'E',
    templateUrl : 'shared/modalError/modalErrorView.html',
    transclude  : true,
    replace     : true,
    scope       : false
  };
});
