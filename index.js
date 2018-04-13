'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _scionCore = require('scion-core');

module.exports = function (statechart, opts) {
  var sc = void 0;

  var options = opts || {};

  setTimeout(function () {
    sc = new _scionCore.Statechart({ states: statechart });

    sc.on('onEntry', function (state) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var action = _extends({}, event);
      action.type = 'a:entry:' + state;
      options.log && console.log('entry', state, action);
      store.dispatch(action);
    });

    sc.on('onExit', function (state) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var action = _extends({}, event);
      action.type = 'a:exit:' + state;
      options.log && console.log('exit', state, action);
      store.dispatch(action);
    });

    sc.on('onTransition', function (state, targetIds, stxIdx, event) {
      if (event && event.type) {
        var action = _extends({}, event);
        action.type = 'a:transition:' + event.type;
        options.log && console.log('transition', action);
        store.dispatch(action);
      }
    });

    sc.start();
  }, 0);

  return function (store) {
    return function (next) {
      return function (action) {
        if (!action.type.startsWith('a:')) {
          sc.gen({
            name: action.type,
            data: action
          });
        } else {
          next(action);
        }
      };
    };
  };
};
