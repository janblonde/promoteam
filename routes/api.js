var express = require('express');
var router = express.Router();
//var mongoose = require("mongoose");
var Page = require('../models/page.js');
var Event = require('../models/event.js');
var AdminUser = require('../models/admin-users.js');
var bcrypt = require('bcrypt-nodejs');
var mysql      = require('mysql');

/* Connection Pool */

var pool = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'janblonde',
    password : '',
    database : 'c9',
    debug    :  false,
    queueLimit: 1000
});

var counter = 0;

/* User Routes */

router.get('/', function(req,res){
  res.send('Welcome to the API zone');    
});

router.post('/customers', sessionCheck, function(req, res){
  
    var offset = req.body.offset;
    var limit = req.body.limit;
    console.log(parseInt(offset) + parseInt(limit));
    
    pool.getConnection(function(err, connection) {
      counter ++;
      if(err){
          connection.release();
          console.log('connection error!');
          return;
      }
      // Use the connection
      connection.query( 'SELECT * from customer ORDER BY id LIMIT ?,?;',[parseInt(offset), parseInt(offset) + parseInt(limit)], function(err, rows) {
        // And done with the connection.
        connection.release();
        if(!err){
          res.json(rows);
        }else{
          console.log('query error!');
        }
    
        // Don't use the connection here, it has been returned to the pool.
      });
    });
   
});

router.get('/customers/total', sessionCheck, function(req, res){
    
    pool.getConnection(function(err, connection) {
      counter ++;
      if(err){
          connection.release();
          console.log('connection error!');
          return;
      }
      // Use the connection
      connection.query( 'SELECT COUNT(*) as total from customer ;', function(err, rows) {
        // And done with the connection.
        connection.release();
        if(!err){
          console.log(rows[0]);
          res.json(rows[0]);
        }else{
          console.log('query error!');
        }
    
        // Don't use the connection here, it has been returned to the pool.
      });
    });
   
});

router.post('/customers/add', sessionCheck, function(request,response){
    
      pool.getConnection(function(err, connection) {
      console.log(counter);
      counter ++;
      if(err){
          connection.release();
          console.log('connection error!');
          return;
      }
      
      // Use the connection
      var sql = "INSERT INTO customer(name,vat_number,email)values('"+
      request.body.name + "','" +
      (request.body.vat_number || "") + "','" + 
      (request.body.email || "") + "');";
      
      console.log(sql);
      
      connection.query( sql, function(err, rows) {
        // And done with the connection.
        connection.release();
        if(!err){
          response.json(rows);
        }else{
          console.log('query insert error!');
          return response.send(500,err);
        }
    
        // Don't use the connection here, it has been returned to the pool.
      });
    });
});

router.post('/customers/update', sessionCheck, function(request,response){

    var id = request.body.id;
    
    var input = JSON.parse(JSON.stringify(request.body));
    var data = {
        name    : input.name,
        vat_number : input.vat_number || ' ',
        email   : input.email || ' ',
    };
    console.log(data);
    
    pool.getConnection(function(err, connection) {
        console.log(counter);
        counter ++;
        if(err){
          connection.release();
          console.log('connection error!');
          return;
        }
    
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err) {
            // And done with the connection.
            connection.release();
            if(err){
              console.log('query error!');
              return response.send(500,err);
            }
        });
    });
    response.send("Event updated");
});


router.get('/customers/delete/:id',  sessionCheck, function(request, response){
    var id = request.params.id;
    console.log("delete id: " + id);
    
    pool.getConnection(function(err, connection) {
        console.log(counter);
        counter ++;
        if(err){
          connection.release();
          console.log('connection error!');
          return;
        }
    
        connection.query("DELETE FROM customer WHERE id = ? ",[id], function(err) {
            // And done with the connection.
            connection.release();
            if(err){
              console.log('query error!');
              return response.send(500,err);
            }
        });
    });
    return response.send('Page id-' + id + ' has been deleted');
});


router.get('/customers/details/:id', sessionCheck, function(request, response){
    var id = request.params.id;
    console.log("details id: " + id);
    
    pool.getConnection(function(err, connection) {
        console.log(counter);
        counter ++;
        if(err){
          connection.release();
          console.log('connection error!');
          return;
        }
    
        connection.query("SELECT * FROM customer WHERE id = ? ",[id], function(err,rows) {
            // And done with the connection.
            connection.release();
            if(err){
              console.log('query error!');
              return response.send(500,err);
            }else{
              response.json(rows[0]);
            }
        });
    });
});

router.post('/add-user', function(request, response){
   var salt, hash, password;
   password = request.body.password;
   salt = bcrypt.genSaltSync(10);
   hash = bcrypt.hashSync(password, salt);
   console.log(hash);
   
   pool.getConnection(function(err, connection) {
        console.log(counter);
        counter ++;
        if(err){
          connection.release();
          console.log('connection error!');
          return;
        }
    
        connection.query("INSERT INTO user (username,password) VALUES(?,?); ",[request.body.username,hash], function(err) {
            // And done with the connection.
            connection.release();
            if(err){
              console.log('query error!');
              return response.send(500,err);
            }else{
                return response.send('Admin User successfully created');
            }
        });
    });
});

router.post('/login', function(request, response){
   var username = request.body.username;
   var password = request.body.password;
   
   pool.getConnection(function(err, connection) {
        console.log(counter);
        counter ++;
        if(err){
          connection.release();
          console.log('connection error!');
          return;
        }
    
        connection.query("SELECT * from user where username = ? ",[username], function(err,rows) {
            // And done with the connection.
            connection.release();
            if(err | rows.length == 0){
              return response.send(401,"User doesn't exst");
            }else{
              var data = rows[0];
              if(username == data.username && bcrypt.compareSync(password,data.password)){
                request.session.regenerate(function(){
                    request.session.user = username;
                    return response.send(username);
                });
              }else{
                return response.send(401,"Bad username or Password");
              }
            }
        });
    });
});

router.get('logout', function(request, response){
   request.session.destroy(function() {
      return response.send(401, 'User logged out'); 
   }); 
});

module.exports = router;

function sessionCheck(request, response, next){
    
    if(request.session.user) next();
        else response.send(401,'authorization failed');
}