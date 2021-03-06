var Paladin = (function () {
  'use strict';

  var paladin = {};

  function Compositor(args) {
    return function (args) {
      var i = 0,
        len = args.length;

      for (i; i < len; i += 1) {
        (args[i]).call(this);
      }
    };
  }

  paladin.compose = function (args) {
    var fn;
    
    fn = new Compositor(args);

    return function (states, init, modules) {

      fn.call(this, args);

      this.states = function (states) {
        var prop;
        if (states !== undefined) {
          for (prop in states) {
            if (states.hasOwnProperty(prop)) {
              this[prop] = states[prop];
            }
          }
        }
      };

      this.init = function (init) {
        var prop;
        for (prop in init) {
          if (this.hasOwnProperty(prop)) {
            if (typeof this[prop] === 'function' && Array.isArray(init[prop])) {
              this[prop].apply(this, init[prop]);
            }
          }
        }
      };

      this.modules = function (modules) {
        var i = 0, len;
        if (Array.isArray(modules)) {
          len = modules.length;
          for (i; i < len; i += 1) {
            paladin.addModule(this, modules[i]);
          }
        }
      };

      if (!!states) {
        this.states(states);
      }

      if (!!init) {
        this.init(init);
      }

      if (!!modules) {
        this.modules(modules);
      }

    };
  };

  paladin.addModule = function (parent, module) {
    parent[arguments[1].name] = module.call(parent);
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
