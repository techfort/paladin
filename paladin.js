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
    
    return function (states, init, modules) {
      var fn = Compositor(args),
        obj = new fn(args),
        prop,
        i,
        len;

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


      if (!!modules && Array.isArray(modules)) {
        len = modules.length;
        for (i = 0; i < len; i += 1) {
          paladin.addModule(obj, modules[i]);
        }
      }

      return obj;
    };
  };

  
  paladin.addModule = function(parent, module) {
    parent[arguments[1].name] = (module).call(parent);
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
