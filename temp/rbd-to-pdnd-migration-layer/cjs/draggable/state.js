"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.idleState = void 0;
exports.reducer = reducer;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _draggableLocation = require("../drag-drop-context/draggable-location");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var idleState = {
  isDragging: false,
  draggingOver: null
};
exports.idleState = idleState;

function reducer(state, action) {
  if (action.type === 'START_DRAG') {
    (0, _tinyInvariant.default)(!state.isDragging, 'The draggable is idle.');
    var _action$payload = action.payload,
        start = _action$payload.start,
        location = _action$payload.location;
    var draggingOver = start.source.droppableId;

    var nextState = _objectSpread(_objectSpread({}, state), {}, {
      isDragging: true,
      draggingOver: draggingOver,
      location: null,
      start: start.source,
      draggableId: start.draggableId,
      mode: start.mode
    });

    if (location) {
      return reducer(nextState, {
        type: 'UPDATE_CURSOR',
        payload: {
          location: location
        }
      });
    }

    return nextState;
  }

  if (action.type === 'UPDATE_DRAG') {
    (0, _tinyInvariant.default)(state.isDragging, 'The draggable is dragging.');
    var destination = action.payload.destination;

    var _draggingOver = destination ? destination.droppableId : null;

    return _objectSpread(_objectSpread({}, state), {}, {
      draggingOver: _draggingOver
    });
  }

  if (action.type === 'UPDATE_CURSOR') {
    var _location = action.payload.location;

    var _nextState = _objectSpread(_objectSpread({}, state), {}, {
      location: _location
    });

    if (!state.isDragging) {
      /**
       * Virtualized items can unmount and remount during the drag.
       *
       * When they remount, their internal state won't have them marked as
       * dragging.
       *
       * TODO: find a nicer solution
       */
      var _destination = (0, _draggableLocation.getDraggableLocation)(_location.current);

      var _draggingOver2 = _destination ? _destination.droppableId : null;

      Object.assign(_nextState, {
        isDragging: true,
        draggingOver: _draggingOver2
      });
    }

    return _nextState;
  }

  if (action.type === 'DROP') {
    (0, _tinyInvariant.default)(state.isDragging, 'The draggable is dragging.');
    return idleState;
  }

  return state;
}