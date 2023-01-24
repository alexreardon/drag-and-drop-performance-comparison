"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DraggableClone = DraggableClone;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactDom = require("react-dom");

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _element = require("@atlaskit/drag-and-drop/adapter/element");

var _combine = require("@atlaskit/drag-and-drop/util/combine");

var _capturedDimensionsContext = require("../drag-drop-context/captured-dimensions-context");

var _draggableLocation = require("../drag-drop-context/draggable-location");

var _instanceIdContext = require("../drag-drop-context/instance-id-context");

var _lifecycleContext = require("../drag-drop-context/lifecycle-context");

var _data = require("../draggable/data");

var _state = require("../draggable/state");

var _useDragPreview = require("../draggable/use-drag-preview");

var _attributes = require("../utils/attributes");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function getBody() {
  return document.body;
}
/**
 * Calls the `renderClone` function.
 *
 * Only rendered during drags.
 */


function DraggableCloneInner(_ref) {
  var children = _ref.children,
      droppableId = _ref.droppableId,
      type = _ref.type,
      draggableId = _ref.draggableId,
      index = _ref.index,
      draggingOver = _ref.draggingOver,
      style = _ref.style,
      _ref$getContainerForC = _ref.getContainerForClone,
      getContainerForClone = _ref$getContainerForC === void 0 ? getBody : _ref$getContainerForC;
  var provided = (0, _react.useMemo)(function () {
    var _draggableProps;

    return {
      innerRef: function innerRef() {},
      draggableProps: (_draggableProps = {}, (0, _defineProperty2.default)(_draggableProps, _attributes.attributes.draggable.contextId, ''), (0, _defineProperty2.default)(_draggableProps, _attributes.attributes.draggable.id, draggableId), (0, _defineProperty2.default)(_draggableProps, "style", style), _draggableProps),
      dragHandleProps: null
    };
  }, [draggableId, style]);
  var snapshot = (0, _react.useMemo)(function () {
    return {
      isDragging: true,
      isDropAnimating: false,
      isClone: true,
      dropAnimation: null,
      draggingOver: draggingOver,
      // the id of a draggable that you are combining with
      combineWith: null,
      // a combine target is being dragged over by
      combineTargetFor: null,
      // What type of movement is being done: 'FLUID' or 'SNAP'
      mode: 'FLUID'
    };
  }, [draggingOver]);
  var rubric = (0, _react.useMemo)(function () {
    return {
      draggableId: draggableId,
      type: type,
      source: {
        droppableId: droppableId,
        index: index
      }
    };
  }, [draggableId, droppableId, index, type]);
  return /*#__PURE__*/(0, _reactDom.createPortal)(children(provided, snapshot, rubric), getContainerForClone());
}
/**
 * Wrapper that is always rendered if there is a `renderClone` function.
 *
 * It sets up a monitor, and needs to observe the entire lifecycle.
 */


function DraggableClone(_ref2) {
  var children = _ref2.children,
      droppableId = _ref2.droppableId,
      type = _ref2.type,
      getContainerForClone = _ref2.getContainerForClone;
  var instanceId = (0, _instanceIdContext.useInstanceId)();

  var _useReducer = (0, _react.useReducer)(_state.reducer, _state.idleState),
      _useReducer2 = (0, _slicedToArray2.default)(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  var monitorForLifecycle = (0, _lifecycleContext.useMonitorForLifecycle)();
  (0, _react.useEffect)(function () {
    return (0, _combine.combine)(monitorForLifecycle({
      onPendingDragStart: function onPendingDragStart(_ref3) {
        var location = _ref3.location,
            start = _ref3.start;

        if (droppableId !== start.source.droppableId) {
          return;
        }

        dispatch({
          type: 'START_DRAG',
          payload: {
            start: start,
            location: location
          }
        });
      },
      onBeforeDragEnd: function onBeforeDragEnd(_ref4) {
        var draggableId = _ref4.draggableId;

        if (!state.isDragging) {
          return;
        }

        if (draggableId !== state.draggableId) {
          return;
        }

        dispatch({
          type: 'DROP'
        });
      }
    }), (0, _element.monitorForElements)({
      canMonitor: function canMonitor(_ref5) {
        var source = _ref5.source;
        (0, _tinyInvariant.default)((0, _data.isDraggableData)(source.data));
        return source.data.instanceId === instanceId && source.data.droppableId === droppableId;
      },
      onDrag: function onDrag(_ref6) {
        var location = _ref6.location;
        dispatch({
          type: 'UPDATE_CURSOR',
          payload: {
            location: location
          }
        });
      },
      onDropTargetChange: function onDropTargetChange(_ref7) {
        var location = _ref7.location;
        dispatch({
          type: 'UPDATE_DRAG',
          payload: {
            destination: (0, _draggableLocation.getDraggableLocation)(location.current)
          }
        });
      }
    }));
  }, [droppableId, instanceId, monitorForLifecycle, state]);
  var dimensions = (0, _capturedDimensionsContext.useCapturedDimensions)();
  var dragPreview = (0, _useDragPreview.useDragPreview)(dimensions, state);

  if (!state.isDragging) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(DraggableCloneInner, {
    droppableId: droppableId,
    type: type,
    draggableId: state.draggableId,
    index: state.start.index,
    draggingOver: state.draggingOver,
    style: dragPreview.style,
    getContainerForClone: getContainerForClone
  }, children);
}