var socket = io.connect();

$(document).ready(function() {
  var chatApp = new Chat(socket);

  socket.on('nameResult', function(result) {
    var message;

    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
      if (result.prevName) {
        $('#names').text(function(_,txt) {
          var re = new RegExp(result.prevName,"g");
          return txt.replace(re, '');
        });
      }
      $('#names').append(result.name + "<br>");
      $('#names').scrollTop($('#names').prop('scrollHeight'));
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) {
    $('#room').html("<span>Room: </span>").append(result.room);
    $('#messages').append(divSystemContentElement('Room changed to '+ result.room));
  });

  socket.on('message', function(message) {
    var newElement = $('<div id="msg"></div>').text(message.text);
    $('#messages').append(newElement);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  });

  socket.on('rooms', function(rooms) {
    $('#room-list').empty();

    for(var room in rooms) {
      room = room.substring(1, room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElementRoom(room));
      }
    }

    $('#room-list div').click(function() {
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });

  setInterval(function() {
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();
  $('#send-form').submit(function() {
    processUserInput(chatApp, socket);
    return false;
  });
});

function divEscapedContentElementRoom(message) {
  return $('<div class="btn btn-info btn-sm"></div>').text(message);
}

function divEscapedContentElement(message) {
  return $('<div id="msg_user"></div>').text(message);
}

function divSystemContentElement(message) {
  return $('<div id="msg_system"></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val('');
}
