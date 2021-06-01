// Setup basic express server
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')({transports: ['websocket', 'polling'] }).listen(server),
    port = process.env.PORT || 9191;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom...

var numUsers = 0;
var onlineUsers = {};

io.sockets.on('connection', function (socket) {
  var addedUser = false;
  var sockId = socket.id;
  var uId, userKey;

  // when the client emits 'connect', this listens and executes
  socket.on('connectionopen', function (data) {
    socket.uid = data.uid;
    userKey = 'user_'+socket.uid;
    // socket.join(userKey);
    data['frmsock'] = 1;
    onlineUsers[socket.uid]={uid:socket.uid, un: data.un};
    data['users'] = onlineUsers;
    io.emit('connectionopen', data);
  });

  // when the client emits 'new message', this listens and executes
  socket.on('newmessage', function (data) {
    console.log("data", data);
    // we tell the client to execute 'new message'
    data['frmsock'] = 1;
    socket.broadcast.emit('newmessage', data);
    // io.sockets.in('user_'+data['toid']).emit('newmessage', data);
    // socket.broadcast.to('user_'+data['fmid']).emit('newmessage', data);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('adduser', function (data) {
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = data.username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('userjoined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function (data) {
    data['frmsock'] = 1;
    // io.sockets.in('user_'+data['toid']).emit('typing', data);
    socket.broadcast.emit('typing', data);
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stoptyping', function (data) {
    data['frmsock'] = 1;
    // io.sockets.in('user_'+data['toid']).emit('typing', data);
    socket.broadcast.emit('typing', data);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
      console.log("disconnect");

      // echo globally that this client has left
      console.log("socket.uid", socket.uid);
      delete onlineUsers[socket.uid];
      io.emit('disconnect', onlineUsers);

      socket.leave(userKey);

  });
});