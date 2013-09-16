var Paladin = (function () {
  'use strict';
  var paladin = {};
  paladin.compose = function (args) {

    function Compositor(args) {
      return function() {
        var o = args[0],
          i = 0,
          len = args.length,
          obj;
        
        for (i; i < len; i += 1) {
          (args[i]).call(this);
        }  
      }
    }
    
    return function (states, init) {
      var fn = Compositor(args),
        obj = new fn(args);
      var  prop;
      if (states !== undefined) {
        for (prop in states) {
          if (states.hasOwnProperty(prop)) {
            obj[prop] = states[prop];
          }
        }
      }

      for (prop in init) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'function' && Array.isArray(init[prop])) {
          obj[prop].apply(obj, init[prop]);
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
    window.Paladin = Paladin;
  }
}
