module.exports = function (server) {
  var io = require('socket.io')(server);
  var redisAdapter = require('socket.io-redis');

  var redis = require("redis");
  var client = redis.createClient();

  io.adapter(redisAdapter({ host: 'localhost', port: 6379}));

  var identify = function (socket, userId) {
    client.set(socket.id, userId);
  };

  var join = function (socket, room) {
    //TODO check if room exists in database
    //TODO persist room in redis. Check http://redis.io/commands#set SADD

    client.get(socket.id, function (err, userId) {
      socket.join(room, function(){
        console.log(socket.rooms, room);
        io.to(socket.rooms[1]).emit('joined', {userId: userId});
      });
    });
  };

  var leave = function (socket, room) {
    //TODO check if room still has people in
    //TODO persist room in redis. Check http://redis.io/commands#set SREM
    client.get(socket.id, function (err, userId) {
      io.to(socket.rooms[1]).emit('left', {userId: userId});
      socket.leave(room);
    });
  };

  var voteUp = function (socket, trackId) {
    //TODO
    //check http://redis.io/commands#sorted_set ZINCRBY
    var queue = [];
    io.to(socket.rooms[1]).emit('queue:update', queue);
  };

  var voteDown = function (socket, trackId) {
    //TODO
    //check http://redis.io/commands#sorted_set ZINCRBY
    var queue = [];
    io.to(socket.rooms[1]).emit('queue:update', queue);
  };

  var skipCurrentTrack = function (socket, trackId) {
    //TODO check how many votes to skip versus number of people in the room
    //TODO check if it's the current track being played
  };

  var addTrackToQueue = function(socket, trackId){
    //TODO check http://redis.io/commands#sorted_set ZADD
  };

  var chatSend = function(socket, message){
    //TODO escape message
    //TODO sort history for a while ?? like 2 hours ? see http://redis.io/commands/expire
    //TODO tag using a timestamp for ordering
    //TODO add user id on the message
    io.to(socket.rooms[1]).emit('chat:received', message);
  };

  io.on('connection', function (socket) {
    socket.on('disconnect', function () {
      if(socket.rooms.length > 0){
        leave(socket, socket[0])
      }
    });

    socket.on('error', function (err) {
      console.log('error', err);
    });

    socket.on('identify', function (userId) {
      identify(socket, userId);
    });

    socket.on('join', function (room) {
      console.log('join', arguments);
      join(socket, room);
    });

    socket.on('leave', function (room) {
      leave(socket, room);
    });

    socket.on('queue:add', function (trackId) {
      //Not sure we need the trackId... but maybe in case of having 2 people off sync.
      addTrackToQueue(socket, trackId)
    });

    socket.on('vote:up', function (trackId) {
      voteUp(socket, trackId);
    });

    socket.on('vote:down', function (trackId) {
      voteDown(socket, trackId);
    });

    socket.on('skip', function (trackId) {
      //Not sure we need the trackId... but maybe in case of having 2 people off sync.
      skipCurrentTrack(socket, trackId)
    });

    socket.on('chat:send', function (message) {
      chatSend(socket, message);
    });

    socket.on('vote:down', function (trackId) {
      voteDown(socket, trackId);
    });
  });
};