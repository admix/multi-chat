var http = require("http"),
    express = require("express"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime"),
    habitat = require("habitat"),
    cons = require('consolidate'),
    dba = require('./public/js/db'),
    validator = require('validator'),
    nodemailer = require('nodemailer'),
    sendEmail = require('./public/js/email'),
    cache = {};

var MongoClient = require("mongodb").MongoClient,
    Server = require("mongodb").Server;
habitat.load();

var env = new habitat(),
    app = express(),
    server = http.createServer(app),
    port = Number(env.get("PORT") || 8080);

MongoClient.connect('mongodb://localhost:27017/emails', function(err, db) {
    "use strict";
    if(err) throw err;
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    //middleware
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    // socket.io server
    var chatServer = require('./lib/chat_server');
    chatServer.listen(server);

    app.use(express.static(__dirname + "/public"));

    app.use(function(err, req, res, next) {
      // if error occurs
      res.send(500, { error: 'Sorry something bad happened!' });
    });

    app.get('*', function(req, res, next) {
      //res.render('404');
      res.render(__dirname + "/public/" + '404');
    });

    app.post('/', function(req, res) {
      var email = req.body.email;
      console.log("email: " + email);
      if (validator.isEmail(email)){
        console.log("true email");
        dba.testEmail(db, email, function(err, msg) {
          if(err) throw err;
          if(msg == null) {
            sendEmail.sendEmail(email);
            res.render(__dirname + "/public/" + 'index',{email:email + " added"});
          } else {
            res.render(__dirname + "/public/" + 'index',{email:email + " already used"});
            console.log("Already exist");
          }
        })
        // dba.checkEmail(db, email, function(err, msg) {
        //   if(err) throw err;
        //   if(msg != email) {
        //     dba.addEmail(db, email, function(err, msg) {
        //       if(err) throw err;
        //       console.log("Added email: " + msg);
        //     });
        //   } else {
        //     console.log("Not added");
        //   }
        // });
      } else {
        console.log("Bad email");
      }
    })
    // starting app server, the last function to call
    server.listen(port);
    console.log("Server listening on port: " + port);
});
