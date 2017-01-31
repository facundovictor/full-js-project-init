/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Angular app for managing clients and providers.
 */

// The app will be accessible from all the modules
var app = angular.module('publicApp', ['ngRoute']);

// APP Configuration
app.constant('appConfig', {
  apiUrl      : 'http://localhost:8000',
  environment : 'development'
});

// Add route configuration
app.config(['$routeProvider', $routeProvider => {
  $routeProvider
    .when('/clients', {
      templateUrl  : 'components/client/clientView.html',
      controller   : 'clientController',
      controllerAs : 'vm'
    })
    .otherwise({
      redirectTo : '/clients'
    });
}]);
