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
