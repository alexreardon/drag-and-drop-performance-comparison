"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragDropContext = DragDropContext;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));

var _dragAndDropAutoscroll = require("@atlaskit/drag-and-drop-autoscroll");

var _element = require("@atlaskit/drag-and-drop/adapter/element");

var _cancelUnhandled = require("@atlaskit/drag-and-drop/addon/cancel-unhandled");

var _data = require("../draggable/data");

var _data2 = require("../droppable/data");

var _cancelDrag = require("./cancel-drag");

var _capturedDimensionsContext = require("./captured-dimensions-context");

var _draggableLocation = require("./draggable-location");

var _errorBoundary = require("./error-boundary");

var _getDestination = require("./get-destination");

var _instanceIdContext = require("./instance-id-context");

var _keyboardContext = require("./keyboard-context");

var _lifecycleContext = require("./lifecycle-context");

var _screenReader = require("./screen-reader");

var _useScheduler2 = require("./use-scheduler");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getInstanceId = function getInstanceId() {
  return Symbol('<DragDropContext />');
};

function getDimensions(element) {
  var _window$getComputedSt = window.getComputedStyle(element),
      margin = _window$getComputedSt.margin;

  var rect = element.getBoundingClientRect();
  return {
    margin: margin,
    rect: rect
  };
}

function DragDropContext(_ref) {
  var children = _ref.children,
      onBeforeCapture = _ref.onBeforeCapture,
      onBeforeDragStart = _ref.onBeforeDragStart,
      onDragStart = _ref.onDragStart,
      onDragUpdate = _ref.onDragUpdate,
      onDragEnd = _ref.onDragEnd;

  var _useState = (0, _react.useState)(getInstanceId),
      _useState2 = (0, _slicedToArray2.default)(_useState, 1),
      instanceId = _useState2[0];

  var lifecycle = (0, _lifecycleContext.useLifecycle)();

  var _useScheduler = (0, _useScheduler2.useScheduler)(),
      schedule = _useScheduler.schedule,
      flush = _useScheduler.flush;

  var dragStateRef = (0, _react.useRef)({
    isDragging: false
  });
  var getDragState = (0, _react.useCallback)(function () {
    return dragStateRef.current;
  }, []);
  (0, _react.useEffect)(function () {
    /**
     * If there is a drag when the context unmounts, cancel it.
     */
    return function () {
      var _getDragState = getDragState(),
          isDragging = _getDragState.isDragging;

      if (isDragging) {
        (0, _cancelDrag.cancelDrag)();
      }
    };
  }, [getDragState]);
  var startDrag = (0, _react.useCallback)(function (_ref2) {
    var draggableId = _ref2.draggableId,
        type = _ref2.type,
        getSourceLocation = _ref2.getSourceLocation,
        sourceElement = _ref2.sourceElement,
        location = _ref2.location,
        mode = _ref2.mode;
    var before = {
      draggableId: draggableId,
      mode: mode
    }; // This is called in `onDragStart` rather than `onGenerateDragPreview`
    // to avoid a browser bug. Some DOM manipulations can cancel
    // the drag if they happen early in the drag.
    // <https://bugs.chromium.org/p/chromium/issues/detail?id=674882>

    onBeforeCapture === null || onBeforeCapture === void 0 ? void 0 : onBeforeCapture(before);
    var start = {
      mode: mode,
      draggableId: draggableId,
      type: type,
      source: getSourceLocation()
    };
    dragStateRef.current = {
      isDragging: true,
      mode: mode,
      capturedDimensions: getDimensions(sourceElement),
      prevDestination: null
    };
    onBeforeDragStart === null || onBeforeDragStart === void 0 ? void 0 : onBeforeDragStart(start);
    /**
     * This is used to signal to <Draggable> and <Droppable> elements
     * to update their state.
     *
     * This must be synchronous so that they have updated their state
     * by the time that `DragStart` is published.
     */

    lifecycle.dispatch('onPendingDragStart', {
      start: start,
      location: location
    }); // `onDragStart` is called in the next event loop (via `setTimeout`)
    //
    // We can safely assume that the React state updates have occurred by
    // now, and that the updated `snapshot` has been provided.
    // <https://twitter.com/alexandereardon/status/1585784101885263872>

    schedule(function () {
      var start = {
        mode: mode,
        draggableId: draggableId,
        type: type,
        source: getSourceLocation()
      };

      var _getProvided = (0, _screenReader.getProvided)('onDragStart', start),
          provided = _getProvided.provided,
          getMessage = _getProvided.getMessage;

      onDragStart === null || onDragStart === void 0 ? void 0 : onDragStart(start, provided);
      (0, _screenReader.announce)(getMessage());
      /**
       * If a drop target is disabled, there needs to be a `DragUpdate`
       * with `destination === null` published.
       *
       * But disabling the drop target won't trigger an `onDropTargetChange`
       * so we need to manually check for this.
       *
       * This is scheduled because changing `isDropDisabled` during
       * `onDragStart` is supported. If it was synchronous then state
       * updates in components won't have occurred yet.
       */

      schedule(function () {
        if (!location) {
          return;
        }

        var droppable = location.initial.dropTargets.find(function (target) {
          return target.data.isDroppable;
        });
        var shouldPublish;

        if (!droppable) {
          /**
           * No droppable being found should only occur if it is disabled.
           */
          shouldPublish = true;
        } else {
          /**
           * Otherwise, if there is a droppable, then we want to publish
           * a `DragUpdate` if it is disabled.
           */
          var data = droppable.data;
          (0, _tinyInvariant.default)((0, _data2.isDroppableData)(data));
          shouldPublish = data.getIsDropDisabled();
        }

        if (!shouldPublish) {
          return;
        }

        var update = {
          mode: mode,
          draggableId: draggableId,
          type: type,
          source: start.source,
          destination: null,
          combine: null // not supported by migration layer

        };
        onDragUpdate === null || onDragUpdate === void 0 ? void 0 : onDragUpdate(update, provided);
      });
    });
  }, [lifecycle, onBeforeCapture, onBeforeDragStart, onDragStart, onDragUpdate, schedule]);
  var updateDrag = (0, _react.useCallback)(function (_ref3) {
    var draggableId = _ref3.draggableId,
        type = _ref3.type,
        sourceLocation = _ref3.sourceLocation,
        targetLocation = _ref3.targetLocation;
    (0, _tinyInvariant.default)(dragStateRef.current.isDragging);
    var prevDestination = dragStateRef.current.prevDestination;
    /**
     * Computes where it would actually move to
     */

    var nextDestination = (0, _getDestination.getDestination)({
      start: sourceLocation,
      target: targetLocation
    });

    if ((0, _draggableLocation.isSameLocation)(prevDestination, nextDestination)) {
      return;
    }

    dragStateRef.current.prevDestination = nextDestination;
    var update = {
      mode: dragStateRef.current.mode,
      draggableId: draggableId,
      type: type,
      source: sourceLocation,
      destination: nextDestination,
      combine: null // not supported by migration layer

    };
    lifecycle.dispatch('onPendingDragUpdate', {
      update: update,
      targetLocation: targetLocation
    });
    schedule(function () {
      var _getProvided2 = (0, _screenReader.getProvided)('onDragUpdate', update),
          provided = _getProvided2.provided,
          getMessage = _getProvided2.getMessage;

      onDragUpdate === null || onDragUpdate === void 0 ? void 0 : onDragUpdate(update, provided);
      (0, _screenReader.announce)(getMessage());
    });
  }, [lifecycle, onDragUpdate, schedule]);
  var stopDrag = (0, _react.useCallback)(function (_ref4) {
    var draggableId = _ref4.draggableId,
        type = _ref4.type,
        _ref4$reason = _ref4.reason,
        reason = _ref4$reason === void 0 ? 'DROP' : _ref4$reason,
        sourceLocation = _ref4.sourceLocation,
        targetLocation = _ref4.targetLocation;
    (0, _tinyInvariant.default)(dragStateRef.current.isDragging);
    var mode = dragStateRef.current.mode;
    dragStateRef.current = {
      isDragging: false
    };
    flush();
    var destination = (0, _getDestination.getDestination)({
      start: sourceLocation,
      target: targetLocation
    });
    var result = {
      reason: reason,
      type: type,
      source: sourceLocation,
      destination: destination,
      mode: mode,
      draggableId: draggableId,
      combine: null // not supported by migration layer

    };
    /**
     * Tells <Draggable> instances to cleanup.
     */

    lifecycle.dispatch('onBeforeDragEnd', {
      draggableId: draggableId
    });

    var _getProvided3 = (0, _screenReader.getProvided)('onDragEnd', result),
        provided = _getProvided3.provided,
        getMessage = _getProvided3.getMessage;

    onDragEnd(result, provided);
    (0, _screenReader.announce)(getMessage());
  }, [flush, lifecycle, onDragEnd]);
  var dragController = (0, _react.useMemo)(function () {
    return {
      getDragState: getDragState,
      startDrag: startDrag,
      updateDrag: updateDrag,
      stopDrag: stopDrag
    };
  }, [getDragState, startDrag, stopDrag, updateDrag]);
  var updatePointerDrag = (0, _react.useCallback)(function (_ref5) {
    var location = _ref5.location,
        source = _ref5.source;
    var data = source.data;
    (0, _tinyInvariant.default)((0, _data.isDraggableData)(data));
    var draggableId = data.draggableId,
        droppableId = data.droppableId,
        getIndex = data.getIndex,
        type = data.type;
    updateDrag({
      draggableId: draggableId,
      type: type,
      sourceLocation: {
        droppableId: droppableId,
        index: getIndex()
      },
      targetLocation: (0, _draggableLocation.getDraggableLocation)(location.current)
    });
  }, [updateDrag]);
  (0, _react.useEffect)(function () {
    return (0, _element.monitorForElements)({
      canMonitor: function canMonitor(_ref6) {
        var initial = _ref6.initial,
            source = _ref6.source;
        var isValidDraggable = source.data.instanceId === instanceId;

        if (!isValidDraggable) {
          return false;
        }

        var droppable = initial.dropTargets.find(function (dropTarget) {
          return dropTarget.data.isDroppable;
        });

        if (!droppable) {
          /**
           * There may be no droppable in the `dropTargets` if it is disabled.
           *
           * This is still valid.
           */
          return true;
        }

        var isValidDroppable = droppable.data.instanceId === instanceId;
        return isValidDroppable;
      },
      onDragStart: function onDragStart(_ref7) {
        var location = _ref7.location,
            source = _ref7.source;

        _dragAndDropAutoscroll.autoScroller.start({
          input: location.current.input
        });

        _cancelUnhandled.cancelUnhandled.start();

        var data = source.data;
        (0, _tinyInvariant.default)((0, _data.isDraggableData)(data));
        var draggableId = data.draggableId,
            droppableId = data.droppableId,
            getIndex = data.getIndex,
            type = data.type;
        startDrag({
          draggableId: draggableId,
          type: type,
          getSourceLocation: function getSourceLocation() {
            return {
              droppableId: droppableId,
              index: getIndex()
            };
          },
          sourceElement: source.element,
          location: location,
          mode: 'FLUID'
        });
      },
      onDrag: function onDrag(_ref8) {
        var location = _ref8.location,
            source = _ref8.source;

        _dragAndDropAutoscroll.autoScroller.updateInput({
          input: location.current.input
        });

        updatePointerDrag({
          location: location,
          source: source
        });
      },
      onDropTargetChange: function onDropTargetChange(_ref9) {
        var source = _ref9.source,
            location = _ref9.location;
        updatePointerDrag({
          location: location,
          source: source
        });
      },
      onDrop: function onDrop(_ref10) {
        var location = _ref10.location,
            source = _ref10.source;

        _dragAndDropAutoscroll.autoScroller.stop();

        _cancelUnhandled.cancelUnhandled.stop();

        var data = source.data;
        (0, _tinyInvariant.default)((0, _data.isDraggableData)(data));
        var draggableId = data.draggableId,
            droppableId = data.droppableId,
            getIndex = data.getIndex,
            type = data.type;
        stopDrag({
          draggableId: draggableId,
          type: type,
          sourceLocation: {
            droppableId: droppableId,
            index: getIndex()
          },
          targetLocation: (0, _draggableLocation.getDraggableLocation)(location.current)
        });
      }
    });
  }, [flush, instanceId, lifecycle, onBeforeCapture, onBeforeDragStart, onDragEnd, onDragStart, onDragUpdate, schedule, startDrag, stopDrag, updateDrag, updatePointerDrag]);
  return /*#__PURE__*/_react.default.createElement(_errorBoundary.ErrorBoundary, {
    instanceId: instanceId
  }, /*#__PURE__*/_react.default.createElement(_instanceIdContext.InstanceIdContext.Provider, {
    value: instanceId
  }, /*#__PURE__*/_react.default.createElement(_lifecycleContext.LifecycleContextProvider, {
    lifecycle: lifecycle
  }, /*#__PURE__*/_react.default.createElement(_capturedDimensionsContext.CapturedDimensionsProvider, {
    getDragState: getDragState
  }, /*#__PURE__*/_react.default.createElement(_keyboardContext.KeyboardContextProvider, {
    dragController: dragController
  }, children)))));
}