var config = require('./config');
var processing = require('./processing');

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
client.track('#LLAP');
client.track('#OffendEveryoneIn4Words');

client.on('tweet', function(tweet) {
  var notes = processing.process(tweet);
  var data = {
    tweet: tweet.text,
    notes: notes
  };
  io.emit('tweet', data);
});


http.listen(process.env.PORT || 3000);
