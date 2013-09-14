if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F();
        }
    })();
}

function Car() {
  this.model = '';
}

function Engine() {
  var cc = 1800;
  
  this.start = function() {
    console.log(this.model + ' is moving...'); 
  };
  this.setCC = function(ccs) {
    cc = ccs;
    return this;
  };
  this.getCC = function() {
    return cc; 
  };
}

function CDPlayer() {
  var playlist = [];
  var position = -1;
  var isPlaying = false;
  this.play = function() {
    if (playlist.length > 0) {
      if (position === -1) {
        position = 0;
      }
      isPlaying = true;
      console.log(this.model + ' -> Playing: ' + playlist[position]); 
    } else {
      throw 'No songs in playlist';  
    }
    return this;
  };
  
  this.addTrack = function(song) {
    playlist.push(song);
    return this;
  };
  
  this.removeTrack = function(song) {
    if (playlist.indexOf(song) !== -1) {
      playlist.slice(playlist.indexOf(song), 1);  
    }
    return this;
  };
  
  this.next = function() {
    if (!isPlaying) {
      throw 'Player is not playing!!';  
    }
    position = (position + 1) % playlist.length;
    return this;
  };
  
  this.prev = function() {
    if (!isPlaying) {
      throw 'Player is not playing!!';  
    }
    position = (position - 1) % playlist.length;
    return this;
  };
  
  this.pause = function() {
    isPlaying = false; 
    return this;
  };
  
  this.getTrack = function() {
    return playlist[position];  
  };
}

function Compositor(){
  
  var args = Array.prototype.slice.call(arguments, 1),
    o = arguments[0],
    i = 0,
    len = args.length,
    obj;
  
  function F() {}
  F.prototype = o;
  obj = new F();
  
    
  console.log(obj);
    
  for ( ; i < len; i += 1) {
    (args[i]).call(obj);
  }
  return obj;
}

var composed = Compositor(Car, Engine, CDPlayer);
composed.model = 'Toyota Composed';
composed.start();
composed.addTrack('Cirith Ungol').addTrack('King of the Dead').play()

