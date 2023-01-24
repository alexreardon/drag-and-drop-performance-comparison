"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DroppableContextProvider = void 0;
exports.useDroppableContext = useDroppableContext;

var _react = require("react");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var DroppableContext = /*#__PURE__*/(0, _react.createContext)(null);
var DroppableContextProvider = DroppableContext.Provider;
exports.DroppableContextProvider = DroppableContextProvider;

function useDroppableContext() {
  var value = (0, _react.useContext)(DroppableContext);
  (0, _tinyInvariant.default)(value, 'Missing <Droppable /> parent');
  return value;
}