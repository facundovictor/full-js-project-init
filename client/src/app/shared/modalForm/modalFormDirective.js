/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Simple and generic modal form.
 */

app.directive('modalForm', function(){
  return {
    restrict    : 'E',
    templateUrl : 'shared/modalForm/modalFormView.html',
    transclude  : true,
    replace     : true,
    scope       : false
  };
});
