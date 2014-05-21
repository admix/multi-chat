var http = require("http"),
    fs = require("fs"),
    path = require("path"),
    mime = require("mime"),
    habitat = require("habitat"),
    cache = {};

habitat.load();
var env = new habitat(),
    port = Number(env.get("PORT") || 8080);

var server = http.createServer(function(request, response) {
  var filePath = false;

  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }

  var absPath = './' + filePath;
  serverStatic(response, cache, absPath);
})
// socket.io server
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

server.listen(port, function() {
  console.log("Server listening on port: " + port);
});

// 404 Error
function send404(response) {
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}

// Sending conents of file
function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    {"content-type": mime.lookup(path.basename(filePath))}
  );
  response.end(fileContents);
}

function serverStatic(response, cache, absPath) {
  if (cache[absPath]) { //check if file is cached in memory
    sendFile(response, absPath, cache[absPath]); //serve file from memory
  } else {
    fs.exists(absPath, function(exists) { //check if file exists
      if (exists) {
        fs.readFile(absPath, function(err, data) { //read file from disk
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data); //serve file read from disk
          }
        });
      } else {
        send404(response); //send HTTP 404 response
      }
    });
  }
}
