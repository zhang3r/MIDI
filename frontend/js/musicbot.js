(function (window) {
  //App setup
  var Musicbot = window.MusicBot = function ($ui) {
    var self = this;
    //Application entry point
    console.log("Initializing...");

    this.$ui = $($ui);

    this.player = new MusicBotPlayer();
    this.player.delay = 1;
    this.player.onNotePlayed = function (data) {
      $('.tweet-text', this.$ui).append("\r\n"+data.tweet);
      $('.tweet-text', this.$ui).append("\r\n---------------------------------------");
      $('.tweet-text', this.$ui).scrollTop($('.tweet-text', this.$ui)[0].scrollHeight - $('.tweet-text', this.$ui).height());
    };


    this.socket = new MusicBotSocket()
    this.socket.onData = "TODO";
    this.socket.connect();
    this.socket.onData = function (data) {
      self.player.queue(data);
    };

    this.setStatus("Stopped");
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
    this.interval = setInterval(function () {
      self.processNote.call(self);
    }, this.delay * 1000);
  };
  MusicBotPlayer.prototype.stop = function () {
    clearInterval(this.interval);
    this.interval = null;
  };
  MusicBotPlayer.prototype.queue = function (data) {
    if (this.buffer.length > 20) {
      return;
    }
    this.buffer.push(data);
    if (this.buffer.length > 20) {
      this.buffer.shift();
    }
  };
  MusicBotPlayer.prototype.isPlaying = function () {
    return (this.interval) ? true : false;
  };
  MusicBotPlayer.prototype.processNote = function () {
    if (this.buffer.length <= 0) {
      return;
    }
    console.log('Processing index: ', this.pointer);

    //Play the current note
    var velocity = 127;
    MIDI.setVolume(0, 127);
    MIDI.noteOn(0, this.buffer[this.pointer].note, velocity, 0);
    MIDI.noteOff(0, this.buffer[this.pointer].note, this.delay);

    if (this.onNotePlayed) {
      this.onNotePlayed(this.buffer[this.pointer]);
    }

    this.pointer = (this.pointer + 1) % (this.buffer.length || 1);

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
})(window);