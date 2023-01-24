import invariant from 'tiny-invariant';
import { getElementByDraggableLocation } from '../../utils/get-element-by-draggable-location';
import { getGapOffset } from '../gap';
import { directionMapping, lineOffset } from './constants';

function findScrollContainer(element) {
  const {
    overflowX,
    overflowY
  } = getComputedStyle(element);

  if (overflowX === 'scroll' || overflowX === 'auto' || overflowY === 'scroll' || overflowY === 'auto') {
    return element;
  }

  const {
    parentElement
  } = element;

  if (parentElement === null) {
    return null;
  }

  return findScrollContainer(parentElement);
}
/**
 * Returns the closest element that is offset relative to the scroll container.
 */


function getOffsetElement({
  element,
  mode
}) {
  if (mode === 'standard') {
    return element;
  }

  const {
    offsetParent
  } = element;

  if (!offsetParent) {
    /**
     * Sometimes this function gets called after the element has been
     * disconnected / unmounted.
     *
     * This is a bailout. It could be handled more explicitly.
     */
    return element;
  }

  invariant(offsetParent instanceof HTMLElement);
  return offsetParent;
}

function getDroppableOffset({
  element,
  direction
}) {
  const {
    mainAxis
  } = directionMapping[direction];
  const scrollContainer = findScrollContainer(element);

  if (!scrollContainer) {
    return 0;
  }
  /**
   * If the scroll container has static positioning,
   * then we need to add the scroll container's offset as well.
   */


  const {
    position
  } = getComputedStyle(scrollContainer);

  if (position !== 'static') {
    return 0;
  }

  return scrollContainer[mainAxis.offset];
}

function measure({
  element,
  isForwardEdge,
  mode,
  direction
}) {
  const {
    mainAxis,
    crossAxis
  } = directionMapping[direction];
  const offsetElement = getOffsetElement({
    element,
    mode
  });
  const gapOffset = getGapOffset({
    element,
    where: isForwardEdge ? 'after' : 'before',
    direction
  });
  const baseOffset = offsetElement[mainAxis.offset] - lineOffset;
  const mainAxisOffset = isForwardEdge ? baseOffset + element[mainAxis.length] : baseOffset;
  return {
    mainAxis: {
      offset: mainAxisOffset + gapOffset
    },
    crossAxis: {
      offset: offsetElement[crossAxis.offset],
      length: offsetElement[crossAxis.length]
    }
  };
}

export function getDimensions({
  targetLocation,
  direction,
  mode
}) {
  // TODO: restore indicator for empty droppable
  // if (target.data.isDroppable) {
  //   const draggables = queryAllDraggables(extractDroppableId(target.data));
  //   /**
  //    * If there are no draggables, then the indicator should be at the top.
  //    */
  //   if (draggables.length === 0) {
  //     const mainAxisOffset = getDroppableOffset({
  //       element: target.element,
  //       direction,
  //     });
  //     return {
  //       mainAxis: {
  //         offset: mainAxisOffset,
  //       },
  //       crossAxis: {
  //         offset: 0,
  //         length: '100%',
  //       },
  //     };
  //   }
  //   /**
  //    * Otherwise, if there are draggables, then the indicator is at the end.
  //    */
  //   const lastItem = draggables[draggables.length - 1];
  //   const offsetElement = getOffsetElement({ element: lastItem, mode });
  //   const gapOffset = getGapOffset({
  //     element: lastItem,
  //     where: 'after',
  //     direction,
  //   });
  //   const mainAxisOffset =
  //     offsetElement[mainAxis.offset] + lastItem[mainAxis.length] - lineOffset;
  //   const crossAxisOffset = offsetElement[crossAxis.offset];
  //   const crossAxisLength = offsetElement[crossAxis.length];
  //   return {
  //     mainAxis: {
  //       offset: mainAxisOffset + gapOffset,
  //     },
  //     crossAxis: {
  //       offset: crossAxisOffset,
  //       length: crossAxisLength,
  //     },
  //   };
  // }
  if (targetLocation.index === 0) {
    const element = getElementByDraggableLocation(targetLocation);

    if (!element) {
      return null;
    }

    return measure({
      element,
      isForwardEdge: false,
      mode,
      direction
    });
  }

  const element = getElementByDraggableLocation({
    droppableId: targetLocation.droppableId,
    index: targetLocation.index - 1
  });

  if (!element) {
    return null;
  }

  return measure({
    element,
    isForwardEdge: true,
    mode,
    direction
  });
}