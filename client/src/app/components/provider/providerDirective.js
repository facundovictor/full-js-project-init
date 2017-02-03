/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 */

app.directive('providerForm', function(){
  return {
    restrict     : 'E',
    templateUrl  : 'components/provider/providerFormView.html',
    replace      : true,
    scope        : false,
    controller   : 'providerController',
    controllerAs : 'vmProvider'
  };
});
