var Paladin = (function () {
  'use strict';
  var paladin = {};
  paladin.compose = function (args) {

    function Compositor(args) {
      var o = args[0],
        i = 0,
        len = args.length,
        obj;

      function F() {
        return;
      }
      F.prototype = o;
      obj = new F();

      for (i; i < len; i += 1) {
        (args[i]).call(obj);
      }
      return obj;
    }

    return function (states) {
      var obj = Compositor(args), prop;
      if (states !== undefined) {
        for (prop in states) {
          if (states.hasOwnProperty(prop) && typeof states[prop] !== 'function') {
            obj[prop] = states[prop];
          }
        }
      }
      return obj;
    };
  };
  return paladin;
}());

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Paladin;
}
else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Paladin;
    });
  }
  else {
    window.paladin = Paladin;
  }
}
