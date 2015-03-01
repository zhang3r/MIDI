(function (window) {
  //App setup
  var Musicbot = window.MusicBot = function ($ui) {
    var self = this;
    //Application entry point
    console.log("Initializing...");

    this.$ui = $($ui);

    this.player = new MusicBotPlayer();
    this.player.delay = 0.25;
    this.lastText = null;
    this.player.onNotePlayed = function (data) {
      if (self.lastText === data.tweet) {
        //TODO: this is really bad
        return;
      }
      self.lastText = data.tweet;
      $('.tweet-text', this.$ui).html("<br/>"+data.tweet);
    };


    this.socket = new MusicBotSocket()
    this.socket.onData = "TODO";
    this.socket.connect();
    this.socket.onData = function (data) {
      data.notes = MusicBotTransfomer.process({ text: data.tweet });
      for (var i = 0 ; i < data.notes.length; i += Math.round(Math.random()*(12 - 4) + 4)) {
        self.player.queue({ note: data.notes[i], tweet: data.tweet });
      }
    };

    this.setStatus("Ready");
    $('.play-toggle', $ui).on('click', function () {
      if (self.player.isPlaying()) {
        self.player.stop();
        self.setStatus("Stopped");
      } else {
        self.player.start();
        self.setStatus("Started");
      }
    });

    Musicbot.instance = this;
  };

  MusicBot.prototype.$ui = null; //Reference to the UI's container
  MusicBot.prototype.socket = null; //Reference to the socket connection instance
  MusicBot.prototype.player = null; //Reference to the player instance

  //Changes the status text
  MusicBot.prototype.setStatus = function (text) {
    $('.status-text', this.$ui).text(text);
  };


  //Plays a data stream of notes
  var MusicBotPlayer = function () {
    this.pointer = 0;
    this.buffer = [];
    this.interval = null;
  };

  MusicBotPlayer.prototype.pointer = 0; //Current index in buffer
  MusicBotPlayer.prototype.buffer = null; //Contains a buffer of MIDI notes to play
  MusicBotPlayer.prototype.delay = 1; //Delay in seconds between notes
  MusicBotPlayer.prototype.interval = null;
  MusicBotPlayer.prototype.onNotePlayed = null; //Callback when a note is played
  MusicBotPlayer.prototype.start = function () {
    var self = this;
    this.interval = setTimeout(function () {
      self.processNote.call(self);
    }, this.delay * 1000);
  };
  MusicBotPlayer.prototype.stop = function () {
    setTimeout(this.interval);
    this.interval = null;
  };
  MusicBotPlayer.prototype.queue = function (data) {
    //if (this.buffer.length > 20) {
      //return;
    //}
    this.buffer.push(data);
    //if (this.buffer.length > 20) {
      //this.buffer.shift();
    //}
  };
  MusicBotPlayer.prototype.isPlaying = function () {
    return (this.interval) ? true : false;
  };
  MusicBotPlayer.prototype.processNote = function () {
    var self = this;
    if (this.buffer.length <= 0) {
      return;
    }
    console.log('Processing index: ', this.pointer);

    //Play the current note
    var velocity = 127;
    var volume = 127;
    //var delay = this.delay;
    var delay = [0.125, 0.25][Math.round(Math.random()*(2))];
    var duration = delay;

    MIDI.setVolume(0, volume);
    MIDI.noteOn(0, this.buffer[this.pointer].note, velocity, 0);
    MIDI.noteOff(0, this.buffer[this.pointer].note, delay);

    if (this.onNotePlayed) {
      this.onNotePlayed(this.buffer[this.pointer]);
    }

    this.pointer = (this.pointer + 1) % (this.buffer.length || 1);

    this.interval = setTimeout(function () {
      self.processNote.call(self);
    }, duration * 1000);
  };

  //Socket connection
  var MusicBotSocket = function (url) {  };
  MusicBotSocket.prototype.socket = null; //Socket IO reference
  MusicBotSocket.prototype.url = null; //Connection endpoint
  MusicBotSocket.prototype.onData = null; //Data received  callback

 //Start socket connection
  MusicBotSocket.prototype.connect = function () {
    var self = this;
    console.log("Connecting to socket server...");

    this.socket = io('http://radiant-sea-8792.herokuapp.com:80');
    this.socket.on('tweet', function (data) {
      if (self.onData) {
        self.onData(data);
      }
    });
  };

  //Close socket connection
  MusicBotSocket.prototype.close = function () {
    console.log("Closing socket connection...");
  };

  //Helpers to transform a notes array
  var MusicBotTransfomer = function() {};

  MusicBotTransfomer.dummy = function (notes) {
    return notes;
  };
  MusicBotTransfomer.process = function (text) {
    var obj = text;
    var numbers = [];
    var notes = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];
    var tweet = null;
    if( Array.isArray(obj) ) {
      for(var j=0; j< obj.length;j++){

              tweet = obj[j].text;
        for (var i = 0; i < tweet.length; i++) {
          var x = tweet.charAt(i).charCodeAt(0);
          if(x==32){
            continue;
          }
          if(x>73||x<48){
            x = (x%26)+48;
          }


          numbers.push(x);
        }
      }
    }else{
      tweet = obj.text;
      for (var k = 0; k < tweet.length; k++) {
        var num = tweet.charAt(k).charCodeAt(0) % notes.length;
        var note = notes[num] + 48;
        numbers.push(note);
      }
    }
    return numbers;
  };
})(window);