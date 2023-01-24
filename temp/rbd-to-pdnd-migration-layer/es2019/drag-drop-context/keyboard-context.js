import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';
import { attributes, customAttributes, getAttribute } from '../utils/attributes';
import { getDroppablesOfType } from '../utils/get-droppables-by-type';
import { getElementByDraggableLocation } from '../utils/get-element-by-draggable-location';
import { isSameLocation } from './draggable-location';
const KeyboardContext = /*#__PURE__*/createContext(null);
export function useKeyboardContext() {
  const value = useContext(KeyboardContext);
  invariant(value !== null, 'KeyboardContext exists');
  return value;
}
export function KeyboardContextProvider({
  children,
  dragController
}) {
  const {
    startKeyboardDrag
  } = useKeyboardControls(dragController);
  const value = useMemo(() => {
    return {
      startKeyboardDrag
    };
  }, [startKeyboardDrag]);
  return /*#__PURE__*/React.createElement(KeyboardContext.Provider, {
    value: value
  }, children);
}

const hasDroppableId = droppableId => element => getAttribute(element, attributes.droppable.id) === droppableId;

function getAdjacentDroppableOfType({
  droppableId,
  type,
  where
}) {
  const droppables = getDroppablesOfType(type);
  const currentIndex = droppables.findIndex(hasDroppableId(droppableId));
  const adjacentIndex = where === 'before' ? currentIndex - 1 : currentIndex + 1;
  return droppables[adjacentIndex];
}

function getMoveHandlers({
  sourceLocation,
  targetLocation,
  type,
  updateDrag
}) {
  return {
    mainAxis: {
      prev(event) {
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

      next(event) {
        event.preventDefault();
        /**
         * Checks if we can move to the next position.
         *
         * Reasoning: if there is already a draggable with the current index,
         * then it is a possible target.
         */

        const element = getElementByDraggableLocation(targetLocation);

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
      prev(event) {
        event.preventDefault();
        const before = getAdjacentDroppableOfType({
          droppableId: targetLocation.droppableId,
          type,
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

      next(event) {
        event.preventDefault();
        const after = getAdjacentDroppableOfType({
          droppableId: targetLocation.droppableId,
          type,
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


const commonKeyHandlers = {
  PageUp: preventDefault,
  PageDown: preventDefault,
  Home: preventDefault,
  End: preventDefault,
  Enter: preventDefault,
  Tab: preventDefault
};

function getKeyHandlers({
  sourceLocation,
  targetLocation,
  type,
  draggableId,
  dragController,
  direction
}) {
  function updateDrag(targetLocation) {
    dragController.updateDrag({
      draggableId,
      type,
      sourceLocation,
      targetLocation
    });
  }

  const move = getMoveHandlers({
    sourceLocation,
    targetLocation,
    type,
    updateDrag
  });

  if (direction === 'vertical') {
    return { ...commonKeyHandlers,
      ArrowUp: move.mainAxis.prev,
      ArrowDown: move.mainAxis.next,
      ArrowLeft: move.crossAxis.prev,
      ArrowRight: move.crossAxis.next
    };
  }

  return { ...commonKeyHandlers,
    ArrowUp: move.crossAxis.prev,
    ArrowDown: move.crossAxis.next,
    ArrowLeft: move.mainAxis.prev,
    ArrowRight: move.mainAxis.next
  };
}

function getDroppable(droppableId) {
  const result = document.querySelector( // eslint-disable-next-line compat/compat
  `[${attributes.droppable.id}="${CSS.escape(droppableId)}"]`);
  invariant(result instanceof HTMLElement);
  return result;
}

function useKeyboardControls(dragController) {
  const keyboardBindingCleanupRef = useRef(() => {});
  const cleanupKeyboardBindings = useCallback(() => {
    keyboardBindingCleanupRef.current();

    keyboardBindingCleanupRef.current = () => {};
  }, []);
  useEffect(() => {
    return cleanupKeyboardBindings;
  }, [cleanupKeyboardBindings]);
  const startKeyboardDrag = useCallback(({
    draggableId,
    type,
    getSourceLocation,
    sourceElement
  }) => {
    dragController.startDrag({
      draggableId,
      type,
      getSourceLocation,
      sourceElement,
      location: null,
      mode: 'SNAP'
    });
    const sourceLocation = getSourceLocation();
    /**
     * This is mutated by key handlers so we have an up to date
     * knowledge of target location.
     *
     * TODO: don't use mutation like this
     */

    let targetLocation = getSourceLocation();
    const droppable = getDroppable(sourceLocation.droppableId); // TODO: find a better way to get this... element registry?

    const direction = getAttribute(droppable, customAttributes.droppable.direction);
    invariant(direction === 'vertical' || direction === 'horizontal');
    const keyHandlers = getKeyHandlers({
      sourceLocation,
      targetLocation,
      type,
      draggableId,
      dragController,
      direction
    });

    function cancelDrag() {
      dragController.stopDrag({
        draggableId,
        type,
        reason: 'CANCEL',
        sourceLocation,
        targetLocation: null
      });
      cleanupKeyboardBindings();
    }
    /**
     * All of these events should cancel the drag
     */


    const cancelBindings = ['mousedown', 'mouseup', 'click', 'touchstart', 'resize', 'wheel', 'visibilitychange'].map(type => {
      return {
        type,
        listener: cancelDrag
      };
    });
    /**
     * Key bindings are added asynchronously, to avoid the same keydown event
     * from trigging a dragstart and drop.
     */

    requestAnimationFrame(() => {
      keyboardBindingCleanupRef.current = bindAll(window, [{
        type: 'keydown',

        // @ts-expect-error - the type inference is broken
        listener(event) {
          var _keyHandlers$event$ke;

          const {
            isDragging
          } = dragController.getDragState();

          if (!isDragging) {
            return cleanupKeyboardBindings();
          }

          if (event.key === ' ') {
            event.preventDefault();
            dragController.stopDrag({
              draggableId,
              type,
              reason: 'DROP',
              sourceLocation,
              targetLocation
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

      }, ...cancelBindings]);
    });
  }, [cleanupKeyboardBindings, dragController]);
  return {
    startKeyboardDrag
  };
}