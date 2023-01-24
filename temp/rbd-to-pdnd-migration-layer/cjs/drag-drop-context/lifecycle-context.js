"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifecycleContextProvider = LifecycleContextProvider;
exports.emptyRegistry = void 0;
exports.useLifecycle = useLifecycle;
exports.useMonitorForLifecycle = useMonitorForLifecycle;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _combine = require("@atlaskit/drag-and-drop/util/combine");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var emptyRegistry = {
  onPendingDragStart: [],
  onPendingDragUpdate: [],
  onBeforeDragEnd: []
};
exports.emptyRegistry = emptyRegistry;

function useLifecycle() {
  var ref = (0, _react.useRef)(emptyRegistry);
  var addResponder = (0, _react.useCallback)(function (event, responder) {
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
  var dispatch = (0, _react.useCallback)(function (event, data) {
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

var LifecycleContext = /*#__PURE__*/(0, _react.createContext)(null);

function LifecycleContextProvider(_ref) {
  var children = _ref.children,
      lifecycle = _ref.lifecycle;
  var monitorForLifecycle = (0, _react.useCallback)(function (responders) {
    var cleanupFns = [];

    for (var _i = 0, _Object$entries = Object.entries(responders); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
          _event = _Object$entries$_i[0],
          _responder2 = _Object$entries$_i[1];

      if (!_responder2) {
        continue;
      } // FIXME:
      // @ts-expect-error


      cleanupFns.push(lifecycle.addResponder(_event, _responder2));
    }

    return _combine.combine.apply(void 0, cleanupFns);
  }, [lifecycle]);
  return /*#__PURE__*/_react.default.createElement(LifecycleContext.Provider, {
    value: monitorForLifecycle
  }, children);
}

function useMonitorForLifecycle() {
  var monitorForLifecycle = (0, _react.useContext)(LifecycleContext);
  (0, _tinyInvariant.default)(monitorForLifecycle !== null, 'useLifecycle() should only be called inside of a <DragDropContext />');
  return monitorForLifecycle;
}