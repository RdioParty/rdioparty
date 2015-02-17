module.exports = function (server) {
  var io = require('socket.io')(server);
  var redisAdapter = require('socket.io-redis');

  var redis = require("redis");
  var client = redis.createClient();

  io.adapter(redisAdapter({ host: 'localhost', port: 6379}));

  io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('identify', function (userId) {
      client.set(socket.id, userId);
    });

    socket.on('join', function (room) {
      client.get(socket.id, function (err, userId) {
        socket.join(room);

        socket.broadcast.emit('joined', {userId: userId});
      });
    });

    socket.on('leave', function (room) {
      client.get(socket.id, function (err, userId) {
        socket.broadcast.emit('left', {userId: userId});
        socket.leave(room);
      });
    });

    socket.on('disconnect', function () {
      client.get(socket.id, function (err, userId) {
        socket.broadcast.emit('left', {userId: userId});
      });
    });

    socket.on('error', function (err) {
      console.log('error', err);
    })
  });
};