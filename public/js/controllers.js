'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('CustomerCtrl', ['$scope', '$location', '$log', 'customerFactory', 'flashMessageService', '$cookies', '$route',
  function($scope, $location, $log, customerFactory, flashMessageService, $cookies, $route) {
  
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;
  
    $scope.range = function() {
      var rangeSize = 5;
      var ret = [];
      var start;
  
      start = $scope.currentPage;
      if ( start > $scope.pageCount()-rangeSize ) {
        start = $scope.pageCount()-rangeSize;
      }
  
      for (var i=start; i<start+rangeSize; i++) {
        if (i>=0)
        ret.push(i);
      }
      return ret;
    };
  
  
    $scope.prevPage = function() {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };

    $scope.prevPageDisabled = function() {
      return $scope.currentPage === 0 ? "disabled" : "";
    };
  
    $scope.nextPage = function() {
      if ($scope.currentPage < $scope.pageCount() - 1) {
        $scope.currentPage++;
      }
    };
  
    $scope.nextPageDisabled = function() {
      return $scope.currentPage === $scope.pageCount() - 1 ? "disabled" : "";
    };
  
    $scope.pageCount = function() {
      return Math.ceil($scope.total/$scope.itemsPerPage);
    };
  
    $scope.setPage = function(n) {
      if (n >= 0 && n < $scope.pageCount()) {
        $scope.currentPage = n;
      }
    };

    $scope.$watch("currentPage", function(newValue, oldValue) {
      customerFactory.getCustomers(newValue*$scope.itemsPerPage, $scope.itemsPerPage).then(
        function(res,err){
          console.log(res);
          $scope.allCustomers = res.data;
        },
        function(err){
          $log.log(err);
        }
      );
      customerFactory.total().then(
        function(res,err){
          $scope.total = res.data;
        },
        function(err){
          $log.log(err);
        })
    });

      
    $scope.deleteCustomer = function(id){
      customerFactory.deleteCustomer(id).then(
        function(response){
          flashMessageService.setMessage("Customer Deleted Successfully");
          $location.path('/customers');
          $route.reload();
        },
        function(error){
          $log.error(error);
        }
      );
    };

  }])
  .controller('AdminLoginCtrl', ['$scope','$location','$cookies','AuthService','$log','flashMessageService',
  function($scope, $location,$cookies,AuthService,$log,flashMessageService){
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function(credentials) {
      AuthService.login(credentials).then(
        function(res, err) {
          $cookies.put('loggedInUser',res.data);
          console.log("LOGIN SUCCEED!!");
          $location.path('/customers');
        },
        function(err){
          flashMessageService.setMessage(err.data);
          $log.log(err);
        }
      );
    };
  }])
  .controller('AddEditCustomerCtrl', ['$scope', '$log', 'customerFactory',
        '$routeParams', '$location', 'flashMessageService', '$filter',
        function($scope, $log, customerFactory, $routeParams, $location, flashMessageService, $filter) {
            $scope.customer = {};
            $scope.customer._id = $routeParams.id;
            
            console.log("_id: " + $scope.customer._id);
           
            $scope.heading = "Add a New Customer";
            if ($scope.customer._id != 0) {
                $scope.heading = "Update Customer";
                customerFactory.getCustomerDetail($scope.customer._id).then(
                    function(response) {
                        $scope.customer = response.data;
                        $log.info($scope.customer);
                    },
                    function(err) {
                        $log.error(err);
                    });
            }
            $scope.saveCustomer = function() {
                customerFactory.saveCustomer($scope.customer).then(
                    function() {
                        flashMessageService.setMessage("Customer Saved Successfully");
                        $location.path('/customers');
                    },
                    function() {
                        $log.error('error saving data');
                    }
                );
            };
            
        }
    ]);

  
