'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngCookies',
  'message.flash'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/admin/login', {templateUrl: 'partials/admin/login.html', controller: 'AdminLoginCtrl'});
  $routeProvider.when('/customers', {templateUrl: 'partials/customers.html', controller: 'CustomerCtrl'});
  $routeProvider.when('/add-edit-customer/:id', {templateUrl: 'partials/add-edit-customer.html', controller: 'AddEditCustomerCtrl'});
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);
