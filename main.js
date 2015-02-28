var config = require('./config');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var crypto = require('crypto');

var Twitter = require('node-tweet-stream');

io.on('connection', function(socket){
  console.log('a user connected');
});

client = new Twitter(config.twitter);

client.track('#TheDress');

client.on('tweet', function(tweet) {
  var note = tweet.text.length % 26 + 48;
  var data = {
    tweet: tweet.text,
    note: note
  };
  io.emit('tweet', data);
});


http.listen(process.env.PORT || 3000);
