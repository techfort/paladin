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
  var playlist = [],
    position = -1;
    isPlaying = false;
    self = this;
  
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

var simpleCar = Paladin.compose([Car, Engine, CDPlayer]);
var c = new simpleCar({ model: 'Ferrari Paladin' });
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
  this.setWeapon = function (weaponObject) {
    weapon = weaponObject;
    return this;
  };
  this.getWeapon = function() {
    return weapon;
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

function Sword() {
  var name = '';
  this.setName = function(weaponName) {
    name = weaponName;
  };
  this.getName = function() {
    return name;
  };
}

function Demon() {
  this.suckLife = function() {
    console.log('I\'m sucking life out of my victim');
  }
}

function battleCast() {
  console.log(this.name + ' is casting spells while wielding ' + this.getWeapon().getName() );
  return this;
}


var DemonSword = Paladin.compose([Sword, Demon]),
  Stormbringer = new DemonSword({}, { setName : ['Stormbringer']}),
  MournBlade = new DemonSword({}, { setName : ['MournBlade']});

var Melnibonean = Paladin.compose([Character, Sorcerer, Warrior]),
  Elric = new Melnibonean({name: 'Elric', fight: battleCast }, 
    { setWeapon: [Stormbringer] },
    [ skills ]),
  Yrkoon = new Melnibonean({name: 'Yrkoon'}, { setWeapon: [MournBlade] });

Elric.fight();
Elric.skills.addSkill('Summon Arioch')('Destroy World');
console.log('Elric has the following skills: ' + Elric.skills.getSkills().join(', '));
