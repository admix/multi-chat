var http = require("http"),
    express = require("express"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime"),
    habitat = require("habitat"),
    cache = {};

habitat.load();
var env = new habitat(),
    app = express(),
    server = http.createServer(app),
    port = Number(env.get("PORT") || 8080);

// socket.io server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

app.use(express.static(__dirname + "/public"));

app.use(function(err, req, res, next){
  // if error occurs
  res.send(500, { error: 'Sorry something bad happened!' });
});

app.use(function(req, res, next){
  res.send(404, 'Sorry cant find that!');
});

// starting app server, the last function to call
server.listen(port, function() {
  console.log("Server listening on port: " + port);
});
