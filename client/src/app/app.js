/*
 * Author : Facundo Victor <facundovt@gmail.com>
 *
 * Angular app for managing clients and providers.
 */

// The app will be accessible from all the modules
var app = angular.module('publicApp', [
  'ngRoute'
]).config(function ($routeProvider) {
  $routeProvider
    .when('/clients', {
      templateUrl  : 'components/client/clientView.html',
      controller   : 'clientController',
      controllerAs : 'vm'
    })
    .otherwise({
      redirectTo : '/clients'
    });
});

// APP Configuration
app.constant('appConfig', {
  apiUrl      : 'http://localhost:8000',
  environment : 'development'
});
