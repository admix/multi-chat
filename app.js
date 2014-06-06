var http = require("http"),
    express = require("express"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime"),
    habitat = require("habitat"),
    cons = require('consolidate'),
    cache = {};


habitat.load();
var env = new habitat(),
    app = express(),
    server = http.createServer(app),
    port = Number(env.get("PORT") || 8080);

app.engine('html', cons.swig);
app.set('view engine', 'html');

// socket.io server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

app.use(express.static(__dirname + "/public"));

app.use(function(err, req, res, next){
  // if error occurs
  res.send(500, { error: 'Sorry something bad happened!' });
});

app.get('*', function(req, res, next){
  //res.render('404');
  res.render(__dirname + "/public/" + '404');
});

// starting app server, the last function to call
server.listen(port, function() {
  console.log("Server listening on port: " + port);
});
