import _extends from '@babel/runtime/helpers/extends';

import { useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';
import { isSameLocation } from '../../drag-drop-context/draggable-location';
import { customAttributes } from '../../utils/attributes';
import { directionMapping, lineThickness } from './constants';
import { getDimensions } from './get-dimensions';
const baseStyles = css({
  background: 'var(--ds-border-brand, #0C66E4)',
  scrollMarginBlock: 24,
});
const virtualStyles = css({
  position: 'absolute',
  top: 0,
  left: 0,
});
const directionStyles = {
  horizontal: css({
    width: lineThickness,
    height: '100%',
    marginLeft: -lineThickness,
  }),
  vertical: css({
    width: '100%',
    height: lineThickness,
    marginTop: -lineThickness,
  }),
};

function getDynamicStyles({ direction, dimensions, indicatorOffset }) {
  if (dimensions === null) {
    /**
     * We hide the indicator initially until dimensions can be taken.
     */
    return {
      opacity: 0,
    };
  }

  const { mainAxis, crossAxis } = directionMapping[direction];
  return {
    transform: `${mainAxis.style.transform}(${dimensions.mainAxis.offset - indicatorOffset}px)`,
    [crossAxis.style.length]: dimensions.crossAxis.length,
    [crossAxis.style.offset]: dimensions.crossAxis.offset,
  };
} // function isLastItem(source: DragSource): boolean {
//   const droppableId = extractDroppableId(source.data);
//   const draggables = queryAllDraggables(droppableId);
//   const after = draggables.filter(draggable => {
//     const index = parseInt(
//       getAttribute(draggable, customAttributes.draggable.index),
//       10,
//     );
//     return index > extractIndex(source.data);
//   });
//   return after.length === 0;
// }

/**
 * Determines if the drop indicator should be hidden.
 *
 * This is desired when the current drop target would not change the position
 * of the draggable.
 *
 * TODO: test
 */

function shouldHide({ source, destination = null }) {
  return isSameLocation(source, destination);
}

const dropIndicatorData = {
  [customAttributes.dropIndicator]: '',
};
export const DropIndicator = ({ direction, mode, source, destination, targetLocation }) => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    if (!targetLocation) {
      return setDimensions(null);
    }

    if (
      shouldHide({
        source,
        destination,
      })
    ) {
      return setDimensions(null);
    }

    return setDimensions(
      getDimensions({
        targetLocation,
        direction,
        mode,
      }),
    );
  }, [direction, destination, mode, source, targetLocation]);
  useEffect(() => {
    var _element$scrollIntoVi;

    if (dimensions === null) {
      return;
    }

    const element = ref.current;
    invariant(element instanceof HTMLElement); // TODO: only scrollIntoView if done by keyboard
    // FIXME: using ?.() because not supported in Jest... should address that there not here

    (_element$scrollIntoVi = element.scrollIntoView) === null || _element$scrollIntoVi === void 0
      ? void 0
      : _element$scrollIntoVi.call(element, {
          block: 'nearest',
        });
  }, [dimensions]);
  const { mainAxis } = directionMapping[direction];
  const indicatorOffset = ref.current ? ref.current[mainAxis.offset] : 0;
  const dynamicStyles = getDynamicStyles({
    direction,
    dimensions,
    indicatorOffset,
  });
  const isVirtual = mode === 'virtual';
  return jsx(
    'div',
    _extends(
      {
        ref: ref,
        css: [baseStyles, directionStyles[direction], isVirtual && virtualStyles],
        style: dynamicStyles,
      },
      dropIndicatorData,
    ),
  );
};
