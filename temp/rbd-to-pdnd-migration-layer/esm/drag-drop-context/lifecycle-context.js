import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { createContext, useCallback, useContext, useRef } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
export var emptyRegistry = {
  onPendingDragStart: [],
  onPendingDragUpdate: [],
  onBeforeDragEnd: []
};
export function useLifecycle() {
  var ref = useRef(emptyRegistry);
  var addResponder = useCallback(function (event, responder) {
    var registry = ref.current;
    registry[event].push(responder);
    return function () {
      // FIXME:
      // @ts-expect-error
      registry[event] = registry[event].filter(function (value) {
        return value !== responder;
      });
    };
  }, []);
  var dispatch = useCallback(function (event, data) {
    var registry = ref.current;

    var _iterator = _createForOfIteratorHelper(registry[event]),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _responder = _step.value;

        _responder(data);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }, []);
  return {
    addResponder: addResponder,
    dispatch: dispatch
  };
}
var LifecycleContext = /*#__PURE__*/createContext(null);
export function LifecycleContextProvider(_ref) {
  var children = _ref.children,
      lifecycle = _ref.lifecycle;
  var monitorForLifecycle = useCallback(function (responders) {
    var cleanupFns = [];

    for (var _i = 0, _Object$entries = Object.entries(responders); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          _event = _Object$entries$_i[0],
          _responder2 = _Object$entries$_i[1];

      if (!_responder2) {
        continue;
      } // FIXME:
      // @ts-expect-error


      cleanupFns.push(lifecycle.addResponder(_event, _responder2));
    }

    return combine.apply(void 0, cleanupFns);
  }, [lifecycle]);
  return /*#__PURE__*/React.createElement(LifecycleContext.Provider, {
    value: monitorForLifecycle
  }, children);
}
export function useMonitorForLifecycle() {
  var monitorForLifecycle = useContext(LifecycleContext);
  invariant(monitorForLifecycle !== null, 'useLifecycle() should only be called inside of a <DragDropContext />');
  return monitorForLifecycle;
}