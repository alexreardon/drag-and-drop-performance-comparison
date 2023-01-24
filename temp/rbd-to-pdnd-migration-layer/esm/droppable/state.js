import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

export var idleState = {
  draggingFromThisWith: null,
  draggingOverWith: null,
  isDraggingOver: false,
  source: null,
  destination: null,
  targetLocation: null
};
export function reducer(state, action) {
  if (action.type === 'DRAG_START') {
    var _action$payload = action.payload,
        droppableId = _action$payload.droppableId,
        start = _action$payload.start;
    var draggableId = start.draggableId,
        source = start.source;
    var isDraggingOver = source.droppableId === droppableId;
    var draggingOverWith = isDraggingOver ? draggableId : null;
    var isDraggingFrom = source.droppableId === droppableId;
    var draggingFromThisWith = isDraggingFrom ? draggableId : null;
    return _objectSpread(_objectSpread({}, state), {}, {
      isDraggingOver: isDraggingOver,
      draggingFromThisWith: draggingFromThisWith,
      draggingOverWith: draggingOverWith,
      source: start.source,
      destination: start.source,
      targetLocation: start.source
    });
  }

  if (action.type === 'DRAG_UPDATE') {
    var _action$payload2 = action.payload,
        _droppableId = _action$payload2.droppableId,
        targetLocation = _action$payload2.targetLocation,
        update = _action$payload2.update;
    var _update$destination = update.destination,
        destination = _update$destination === void 0 ? null : _update$destination,
        _draggableId = update.draggableId,
        _source = update.source;

    var _isDraggingOver = (destination === null || destination === void 0 ? void 0 : destination.droppableId) === _droppableId;

    var _draggingOverWith = _isDraggingOver ? _draggableId : null;

    var _isDraggingFrom = _source.droppableId === _droppableId;

    var _draggingFromThisWith = _isDraggingFrom ? _draggableId : null;

    return _objectSpread(_objectSpread({}, state), {}, {
      isDraggingOver: _isDraggingOver,
      draggingFromThisWith: _draggingFromThisWith,
      draggingOverWith: _draggingOverWith,
      source: update.source,
      destination: destination,
      targetLocation: targetLocation
    });
  }

  if (action.type === 'DRAG_CLEAR') {
    return idleState;
  }

  return state;
}