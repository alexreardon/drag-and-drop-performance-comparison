import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';
import { attributes, customAttributes, getAttribute } from '../utils/attributes';
import { getDroppablesOfType } from '../utils/get-droppables-by-type';
import { getElementByDraggableLocation } from '../utils/get-element-by-draggable-location';
import { isSameLocation } from './draggable-location';
var KeyboardContext = /*#__PURE__*/createContext(null);
export function useKeyboardContext() {
  var value = useContext(KeyboardContext);
  invariant(value !== null, 'KeyboardContext exists');
  return value;
}
export function KeyboardContextProvider(_ref) {
  var children = _ref.children,
      dragController = _ref.dragController;

  var _useKeyboardControls = useKeyboardControls(dragController),
      startKeyboardDrag = _useKeyboardControls.startKeyboardDrag;

  var value = useMemo(function () {
    return {
      startKeyboardDrag: startKeyboardDrag
    };
  }, [startKeyboardDrag]);
  return /*#__PURE__*/React.createElement(KeyboardContext.Provider, {
    value: value
  }, children);
}

var hasDroppableId = function hasDroppableId(droppableId) {
  return function (element) {
    return getAttribute(element, attributes.droppable.id) === droppableId;
  };
};

function getAdjacentDroppableOfType(_ref2) {
  var droppableId = _ref2.droppableId,
      type = _ref2.type,
      where = _ref2.where;
  var droppables = getDroppablesOfType(type);
  var currentIndex = droppables.findIndex(hasDroppableId(droppableId));
  var adjacentIndex = where === 'before' ? currentIndex - 1 : currentIndex + 1;
  return droppables[adjacentIndex];
}

function getMoveHandlers(_ref3) {
  var sourceLocation = _ref3.sourceLocation,
      targetLocation = _ref3.targetLocation,
      type = _ref3.type,
      updateDrag = _ref3.updateDrag;
  return {
    mainAxis: {
      prev: function prev(event) {
        event.preventDefault();

        if (targetLocation.index === 0) {
          return;
        }

        if (isSameLocation(sourceLocation, {
          droppableId: targetLocation.droppableId,
          index: targetLocation.index - 2
        })) {
          targetLocation.index -= 2;
        } else {
          targetLocation.index -= 1;
        }

        updateDrag(targetLocation);
      },
      next: function next(event) {
        event.preventDefault();
        /**
         * Checks if we can move to the next position.
         *
         * Reasoning: if there is already a draggable with the current index,
         * then it is a possible target.
         */

        var element = getElementByDraggableLocation(targetLocation);

        if (!element) {
          return;
        } // FIXME: don't want to do +2 for the last one


        if (isSameLocation(sourceLocation, targetLocation)) {
          targetLocation.index += 2;
        } else {
          targetLocation.index += 1;
        }

        updateDrag(targetLocation);
      }
    },
    crossAxis: {
      prev: function prev(event) {
        event.preventDefault();
        var before = getAdjacentDroppableOfType({
          droppableId: targetLocation.droppableId,
          type: type,
          where: 'before'
        });

        if (!before) {
          return;
        }

        before.scrollTo(0, 0);
        Object.assign(targetLocation, {
          droppableId: getAttribute(before, attributes.droppable.id),
          index: 0
        });
        updateDrag(targetLocation);
      },
      next: function next(event) {
        event.preventDefault();
        var after = getAdjacentDroppableOfType({
          droppableId: targetLocation.droppableId,
          type: type,
          where: 'after'
        });

        if (!after) {
          return;
        }

        after.scrollTo(0, 0);
        Object.assign(targetLocation, {
          droppableId: getAttribute(after, attributes.droppable.id),
          index: 0
        });
        updateDrag(targetLocation);
      }
    }
  };
}

function preventDefault(event) {
  event.preventDefault();
} // TODO: these could be implemented as extra functionality,
// but rbd does not handle these


var commonKeyHandlers = {
  PageUp: preventDefault,
  PageDown: preventDefault,
  Home: preventDefault,
  End: preventDefault,
  Enter: preventDefault,
  Tab: preventDefault
};

function getKeyHandlers(_ref4) {
  var sourceLocation = _ref4.sourceLocation,
      targetLocation = _ref4.targetLocation,
      type = _ref4.type,
      draggableId = _ref4.draggableId,
      dragController = _ref4.dragController,
      direction = _ref4.direction;

  function updateDrag(targetLocation) {
    dragController.updateDrag({
      draggableId: draggableId,
      type: type,
      sourceLocation: sourceLocation,
      targetLocation: targetLocation
    });
  }

  var move = getMoveHandlers({
    sourceLocation: sourceLocation,
    targetLocation: targetLocation,
    type: type,
    updateDrag: updateDrag
  });

  if (direction === 'vertical') {
    return _objectSpread(_objectSpread({}, commonKeyHandlers), {}, {
      ArrowUp: move.mainAxis.prev,
      ArrowDown: move.mainAxis.next,
      ArrowLeft: move.crossAxis.prev,
      ArrowRight: move.crossAxis.next
    });
  }

  return _objectSpread(_objectSpread({}, commonKeyHandlers), {}, {
    ArrowUp: move.crossAxis.prev,
    ArrowDown: move.crossAxis.next,
    ArrowLeft: move.mainAxis.prev,
    ArrowRight: move.mainAxis.next
  });
}

function getDroppable(droppableId) {
  var result = document.querySelector( // eslint-disable-next-line compat/compat
  "[".concat(attributes.droppable.id, "=\"").concat(CSS.escape(droppableId), "\"]"));
  invariant(result instanceof HTMLElement);
  return result;
}

function useKeyboardControls(dragController) {
  var keyboardBindingCleanupRef = useRef(function () {});
  var cleanupKeyboardBindings = useCallback(function () {
    keyboardBindingCleanupRef.current();

    keyboardBindingCleanupRef.current = function () {};
  }, []);
  useEffect(function () {
    return cleanupKeyboardBindings;
  }, [cleanupKeyboardBindings]);
  var startKeyboardDrag = useCallback(function (_ref5) {
    var draggableId = _ref5.draggableId,
        type = _ref5.type,
        getSourceLocation = _ref5.getSourceLocation,
        sourceElement = _ref5.sourceElement;
    dragController.startDrag({
      draggableId: draggableId,
      type: type,
      getSourceLocation: getSourceLocation,
      sourceElement: sourceElement,
      location: null,
      mode: 'SNAP'
    });
    var sourceLocation = getSourceLocation();
    /**
     * This is mutated by key handlers so we have an up to date
     * knowledge of target location.
     *
     * TODO: don't use mutation like this
     */

    var targetLocation = getSourceLocation();
    var droppable = getDroppable(sourceLocation.droppableId); // TODO: find a better way to get this... element registry?

    var direction = getAttribute(droppable, customAttributes.droppable.direction);
    invariant(direction === 'vertical' || direction === 'horizontal');
    var keyHandlers = getKeyHandlers({
      sourceLocation: sourceLocation,
      targetLocation: targetLocation,
      type: type,
      draggableId: draggableId,
      dragController: dragController,
      direction: direction
    });

    function cancelDrag() {
      dragController.stopDrag({
        draggableId: draggableId,
        type: type,
        reason: 'CANCEL',
        sourceLocation: sourceLocation,
        targetLocation: null
      });
      cleanupKeyboardBindings();
    }
    /**
     * All of these events should cancel the drag
     */


    var cancelBindings = ['mousedown', 'mouseup', 'click', 'touchstart', 'resize', 'wheel', 'visibilitychange'].map(function (type) {
      return {
        type: type,
        listener: cancelDrag
      };
    });
    /**
     * Key bindings are added asynchronously, to avoid the same keydown event
     * from trigging a dragstart and drop.
     */

    requestAnimationFrame(function () {
      keyboardBindingCleanupRef.current = bindAll(window, [{
        type: 'keydown',
        // @ts-expect-error - the type inference is broken
        listener: function listener(event) {
          var _keyHandlers$event$ke;

          var _dragController$getDr = dragController.getDragState(),
              isDragging = _dragController$getDr.isDragging;

          if (!isDragging) {
            return cleanupKeyboardBindings();
          }

          if (event.key === ' ') {
            event.preventDefault();
            dragController.stopDrag({
              draggableId: draggableId,
              type: type,
              reason: 'DROP',
              sourceLocation: sourceLocation,
              targetLocation: targetLocation
            });
            cleanupKeyboardBindings();
            return;
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            cancelDrag();
            return;
          }

          (_keyHandlers$event$ke = keyHandlers[event.key]) === null || _keyHandlers$event$ke === void 0 ? void 0 : _keyHandlers$event$ke.call(keyHandlers, event);
        }
      }].concat(_toConsumableArray(cancelBindings)));
    });
  }, [cleanupKeyboardBindings, dragController]);
  return {
    startKeyboardDrag: startKeyboardDrag
  };
}