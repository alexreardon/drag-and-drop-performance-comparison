import _extends from "@babel/runtime/helpers/extends";
import React, { forwardRef, memo, useMemo } from 'react';
import { useCapturedDimensions } from '../drag-drop-context/captured-dimensions-context';
import { attributes } from '../utils/attributes';
/**
 * Data attributes for the placeholder
 */

const placeholderData = {
  [attributes.placeholder.contextId]: ''
};
export const Placeholder = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(function Placeholder({}, ref) {
  const dimensions = useCapturedDimensions();
  const style = useMemo(() => {
    if (!dimensions) {
      return;
    }

    const {
      margin,
      rect
    } = dimensions;
    return {
      boxSizing: 'border-box',
      width: rect.width,
      height: rect.height,
      margin: margin
    };
  }, [dimensions]);
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    style: style
  }, placeholderData));
}));