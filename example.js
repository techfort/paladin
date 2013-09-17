// example

var Paladin = require('./paladin.js');

function Car() {
  this.model = '';
}

function Engine() {
  var cc = 1800;
  
  this.start = function() {
    console.log(this.model + ' is moving...'); 
    return this;
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
  var self = this;
  
  function playing() {
    console.log(self.model + ' -> Playing: ' + playlist[position]); 
  }
  
  this.play = function() {
    if (playlist.length > 0) {
      if (position === -1) {
        position = 0;
      }
      isPlaying = true;
      playing();
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
    playing();
    return this;
  };
  
  this.prev = function() {
    if (!isPlaying) {
      throw 'Player is not playing!!';  
    }
    position = (position - 1) % playlist.length;
    playing();
    return this;
  };
  
  this.pause = function() {
    isPlaying = false;
    console.log('Paused.');
    return this;
  };
  
  this.getTrack = function() {
    playing();
    return playlist[position];  
  };
}


var c = Paladin.compose([Car, Engine, CDPlayer])({ model: 'Ferrari Paladin' });
c.start()
  .addTrack('Cirith Ungol - Atom Smasher')
  .addTrack('Manilla Road - Astronomica')
  .addTrack('Warlord - Black Mass')
  .addTrack('Salem\'s Wych - Betrayer of Kings')
  .play()
  .next()
  .next()
  .next()
  .pause();


function Character () {
  this.name = '';
}

function Sorcerer () {
  this.cast = function(spell) {
    console.log(this.name + ' is casting ' + spell);
    return this;
  };
}

function Warrior () {
  var weapon = '';
  this.setWeapon = function (weaponName) {
    weapon = weaponName;
    return this;
  };
}

function skills() {
  var skills = [],
    skillsModule;
  skillsModule = {
    addSkill: function(name) {
      skills.push(name);
      return skillsModule.addSkill;
    },
    getSkills: function() {
      return skills;
    }
  };
  return skillsModule;
}


var warMage = Paladin.compose([Character, Sorcerer, Warrior]);

var superMage = Paladin.compose([warMage, function Test() { this.test = 'test....'; }]);

var tester = new superMage( {name: 'Testter'});
console.log(tester);

function battleCasting() {
  console.log(this.name + ' is battle casting!');
  return this;
}

var Elric = new warMage({ name: 'Elric', fight: battleCasting }, { setWeapon: ['Stormbringer'] }, [ skills ]);
var Yrkoon = new warMage({ name: 'Yrkoon', fight: function() { console.log('Yrkoon swinging his sword!'); }}, { setWeapon: ['normal sword']});

Elric.fight();
Yrkoon.fight();
Elric.skills.addSkill('Summon Auroch')('Wield Stormbringer')('Blow the horn of Doom');
console.log(Elric.skills.getSkills().join(', '));
