"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementRegistryProvider = ElementRegistryProvider;
exports.useDroppableRegistry = useDroppableRegistry;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ElementRegistryContext = /*#__PURE__*/(0, _react.createContext)(null);

function ElementRegistryProvider(_ref) {
  var children = _ref.children;
  var registryRef = (0, _react.useRef)({
    droppable: new Map()
  });
  var registerDroppable = (0, _react.useCallback)(function (data) {}, []);
  return /*#__PURE__*/_react.default.createElement(ElementRegistryContext.Provider, {
    value: {
      registerDroppable: registerDroppable
    }
  }, children);
}

function useDroppableRegistry(_ref2) {
  var type = _ref2.type,
      getElement = _ref2.getElement;

  var _useContext = (0, _react.useContext)(ElementRegistryContext),
      registerDroppable = _useContext.registerDroppable;

  (0, _react.useEffect)(function () {}, []);
}