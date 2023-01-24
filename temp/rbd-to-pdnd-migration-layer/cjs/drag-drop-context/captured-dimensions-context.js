"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CapturedDimensionsProvider = CapturedDimensionsProvider;
exports.useCapturedDimensions = useCapturedDimensions;

var _react = _interopRequireWildcard(require("react"));

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var CapturedDimensionsContext = /*#__PURE__*/(0, _react.createContext)(null);

function useCapturedDimensions() {
  var getCapturedDimensions = (0, _react.useContext)(CapturedDimensionsContext);
  (0, _tinyInvariant.default)(getCapturedDimensions !== null);
  return getCapturedDimensions();
}

function CapturedDimensionsProvider(_ref) {
  var children = _ref.children,
      getDragState = _ref.getDragState;
  var getCapturedDimensions = (0, _react.useCallback)(function () {
    var dragState = getDragState();

    if (!dragState.isDragging) {
      return null;
    }

    return dragState.capturedDimensions;
  }, [getDragState]);
  return /*#__PURE__*/_react.default.createElement(CapturedDimensionsContext.Provider, {
    value: getCapturedDimensions
  }, children);
}