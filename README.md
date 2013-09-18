paladin
=======

Javascript composition library.

# Favour composition over inheritance

With Paladin you can put together all your pieces into objects which you can create on-the-fly.

You can re-use your components and combine them together, cache them into functions if you intend to
create multiple objects of the same type, or just create it on the fly, leveraging javascript's higher-order
functions.

Say you have a `Car`. All Cars have an `Engine`, but not all Cars have a `CDPlayer`.

With Paladin you can simply do:

`var simpleCar = Paladin.compose([Car, Engine]);`

then pass some states when you instantiate the car:

`var toyota = simpleCar({ model: 'Toyota' });`

As `Paladin.compose` is returning a function you can even create a simpleCar by doing:

`var ford = Paladin.compose([Car, Engine])({ model: 'Ford'});`

`ford` is a Car, and the Engine methods have a Car context!

Naturally an Engine can be mounted on a `Plane` for example...

`var boeing = Paladin.compose([Plane, Engine])({ model: '777' });`

Now let's create a car with a CDPlayer, let's start it and rock our playlist:

```javascript
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
```

## States, init and modules

The copmosed function takes three optional parameters, states, init and modules.
The states object sets public members to the passed values. I.e. `{ name: 'joe' }` sets the public member name to joe.
With this you can attach functions as methods (see example below).
Init takes method names and arrays for parameters. I.e. `{ setName: ['joe'] }` calls the method `setName` and passes the parameter `'joe'`. 

## Complete Example

And finally a more complete example. A javascript summary of Moorcock's Stormbringer Saga...

```javascript
/**
 * A javascript version of Moorcock's Stormbringer Saga
 */

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

// module pattern function
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

// create a sword that's also a demon
var DemonSword = Paladin.compose([Sword, Demon]),
  // Stormbringer is the coolest sword in the universe
  Stormbringer = new DemonSword({}, { setName : ['Stormbringer']}),
  // MournBlade is Stormbringer's twin blade
  MournBlade = new DemonSword({}, { setName : ['MournBlade']});

// create the race of Melnibone'
var Melnibonean = Paladin.compose([Character, Sorcerer, Warrior]),
  // create Elric, the anithero and attach the battleCast method alised as fight
  Elric = new Melnibonean({name: 'Elric', fight: battleCast },
    // set Elric's weapon to Stormbringer
    { setWeapon: [Stormbringer] },
    // add the skills module (namespaced to skills)
    [ skills ]),
  // Yrkoon is just lame but he happens to wield MournBlade
  Yrkoon = new Melnibonean({name: 'Yrkoon'}, { setWeapon: [MournBlade] });

// let's test everything works as supposed
Elric.fight();
// this is cool because addSkill returns addSkill so you can chain brackets
Elric.skills.addSkill('Summon Arioch')('Destroy World')('Be and Albino Prince');
// and let's print it out
console.log('Elric has the following skills: ' + Elric.skills.getSkills().join(', '));
```