"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstanceIdContext = void 0;
exports.useInstanceId = useInstanceId;

var _react = require("react");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var InstanceIdContext = /*#__PURE__*/(0, _react.createContext)(null);
exports.InstanceIdContext = InstanceIdContext;

function useInstanceId() {
  var value = (0, _react.useContext)(InstanceIdContext);
  (0, _tinyInvariant.default)(value, 'Has <DragDropContext /> as ancestor.');
  return value;
}