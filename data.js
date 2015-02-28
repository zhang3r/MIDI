var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var messages = [];

client.stream('statuses/filter', {track: '#TheDress'}, function(stream){

  stream.on('data', function(tweet) {

    messages.push(tweet);

    if (messages.length === 5){
      json_stuff = JSON.stringify(messages);
      console.log(json_stuff);
      process.exit(0);
    }

  });

  stream.on('error', function(error) {
    console.log(error);
  });
});
