paladin
=======

Javascript Object Composition library, combine constructors and create objects as needed.
Leverage Javascript's own unique feature - `prototype` - but also forget about ever typing it again!

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

`ford` is a Car, and the Engine methods have a common context!

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

### States

Once you generated a composited function, you can create your objects by passing a states object, but you can also call the states method
subsequently to the object creation. I.e.
```javascript
var simpleCar = Paladin.compose([Car, Engine]);
var myCar = new simpleCar();
myCar.states({ model: 'My Car'});
```
You can also attach methods with states:

```javascript
function Break() {
  console.log('Eeeeeeeeeeekkkkk!');
}

var myBreakingCar = new simpleCar({ skid: Break });
myBreakingCar.skid(); // eeeeeeeeeeeeeeeeeeekkkk!
```

### Init

Similarly to states, you can pass an object as the second argument which will call methods on the newly created object. The object structure is 
`{ methodName: [ArrayOfArguments] }`.

For example:
```javascript
myCar.init({ start: [], setModel: ['Ferrari Paladin']});
```

### Modules

Modules is interesting in two respects:

* it allows functions adopting the Module pattern to be attached to another function
* it namespaces the methods to avoid method collision/override

So let's take a look at an example to understand:

```javascript
function CarTank() {
  var capacity = 50,
    current = 0;
  return {
    fill: function() {
      current = 50; // tank is filled with fuel
    },
    consume: function() {
      capacity -= 1;
      if (current === 0) {
        console.log('We\'re out of fuel!');
      }
    }
  };
}

function OilTank() {
  var capacity = 10,
    current = 0;
  return {
    fill: function() {
      current = 10; // oil tank is filled with fuel
    },
    consume: function() {
      capacity -= 1;
    }
  };
}
```
Both modules have a fill method so we may have run into problems...
Using the modules method the `fill()` method gets namespaced.

```javascript
myCar.modules([CarTank, OilTank]);
// let's refill oil and fuel
myCar.OilTank.fill();
myCar.CarTank.fill();
```

## Composing the Composite

As the result of a composition is a function, you can reuse that to further re-compose it.
```javascript
var simpleCar = Paladin.compose([Car, Engine]);
var coolCar = Paladin.compose([simeplCar, CDPlayer]);
var DeLoreanTimeMachine = Paladin.compose([coolCar, TimeMachine]);
```

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
