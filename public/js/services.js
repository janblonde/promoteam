'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
    .factory('customerFactory', ['$http', function($http){
        //   var items = [];
        //   for (var i=0; i<50; i++) {
        //     items.push({ id: i, name: "name "+ i, vat_number: "description " + i, email: "email " + i  });
        //   }
        
        return {
            // get: function(offset, limit) {
            //   return items.slice(offset, offset+limit);
            // },
            // total: function() {
            //   return items.length;
            // },
            getCustomers: function(offset, limit) {
                var params ={
                    "offset": offset,
                    "limit": limit
                }
                return $http.post('/api/customers', params);
            },
            total: function(){
                return $http.get('/api/customers/total');
            },
            saveCustomer: function(customerData) {
                var id = customerData._id;
                
                if (id === "0") {
                    return $http.post('/api/customers/add', customerData);
                }else{
                    return $http.post('/api/customers/update', customerData);
                }
            },
            deleteCustomer: function(id){
                return $http.get('/api/customers/delete/' + id);
            },
            getCustomerDetail: function(id){
                return $http.get('/api/customers/details/' + id);
            },
        };
    }
    ])
    .factory('AuthService', ['$http', function($http){
        return {
            login: function(credentials) {
                return $http.post('/api/login', credentials);
            },
            logout: function(){
                return $http.get('/api/logout');
            }
        }
    }
    ]);
