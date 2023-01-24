"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Placeholder = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _capturedDimensionsContext = require("../drag-drop-context/captured-dimensions-context");

var _attributes = require("../utils/attributes");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Data attributes for the placeholder
 */
var placeholderData = (0, _defineProperty2.default)({}, _attributes.attributes.placeholder.contextId, '');
var Placeholder = /*#__PURE__*/(0, _react.memo)( /*#__PURE__*/(0, _react.forwardRef)(function Placeholder(_ref, ref) {
  (0, _objectDestructuringEmpty2.default)(_ref);
  var dimensions = (0, _capturedDimensionsContext.useCapturedDimensions)();
  var style = (0, _react.useMemo)(function () {
    if (!dimensions) {
      return;
    }

    var margin = dimensions.margin,
        rect = dimensions.rect;
    return {
      boxSizing: 'border-box',
      width: rect.width,
      height: rect.height,
      margin: margin
    };
  }, [dimensions]);
  return /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
    ref: ref,
    style: style
  }, placeholderData));
}));
exports.Placeholder = Placeholder;