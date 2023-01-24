"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBoundary = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _bindEventListener = require("bind-event-listener");

var _element = require("@atlaskit/drag-and-drop/adapter/element");

var _combine = require("@atlaskit/drag-and-drop/util/combine");

var _cancelDrag = require("./cancel-drag");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/**
 * This component holds the actual error boundary logic.
 */
function ErrorBoundaryInner(_ref) {
  var children = _ref.children;
  var isDraggingRef = (0, _react.useRef)(false);
  var handleWindowError = (0, _react.useCallback)(function () {
    if (isDraggingRef.current) {
      (0, _cancelDrag.cancelDrag)(); // warning(`
      //   An error was caught by our window 'error' event listener while a drag was occurring.
      //   The active drag has been aborted.
      // `);
    } // TODO: handle RBDInvariant
    // const err: Error = event.error;
    // if (err instanceof RbdInvariant) {
    //   // Marking the event as dealt with.
    //   // This will prevent any 'uncaught' error warnings in the console
    //   event.preventDefault();
    //   if (process.env.NODE_ENV !== 'production') {
    //     error(err.message);
    //   }
    // }

  }, []);
  (0, _react.useEffect)(function () {
    return (0, _combine.combine)((0, _element.monitorForElements)({
      onDragStart: function onDragStart() {
        isDraggingRef.current = true;
      },
      onDrop: function onDrop() {
        isDraggingRef.current = false;
      }
    }), (0, _bindEventListener.bind)(window, {
      type: 'error',
      listener: handleWindowError
    }));
  }, [handleWindowError]);
  return children;
}
/**
 * Cancels drags when errors occur.
 */
// We have to use a class component to create an error boundary
// eslint-disable-next-line @repo/internal/react/no-class-components


var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary() {
    (0, _classCallCheck2.default)(this, ErrorBoundary);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(err) {
      // TODO: handle RBDInvariant
      // if (err instanceof RbdInvariant) {
      //   if (process.env.NODE_ENV !== 'production') {
      //     error(err.message);
      //   }
      //   this.setState({});
      //   return;
      // }
      // throwing error for other error boundaries
      throw err;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement(ErrorBoundaryInner, {
        instanceId: this.props.instanceId
      }, this.props.children);
    }
  }]);
  return ErrorBoundary;
}(_react.default.Component);

exports.ErrorBoundary = ErrorBoundary;