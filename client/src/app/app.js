
var app = angular.module('publicApp', [
  'ngRoute'
]).config(function ($routeProvider) {
  $routeProvider
    .when('/clients', {
      templateUrl  : 'components/client/clientView.html',
      controller   : 'clientController',
      controllerAs : 'client'
    })
    .otherwise({
      redirectTo : '/clients'
    });
});

app.constant('apiConfig', {
  apiUrl : 'http://localhost:8000'
});
