import _extends from "@babel/runtime/helpers/extends";
import _objectDestructuringEmpty from "@babel/runtime/helpers/objectDestructuringEmpty";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React, { forwardRef, memo, useMemo } from 'react';
import { useCapturedDimensions } from '../drag-drop-context/captured-dimensions-context';
import { attributes } from '../utils/attributes';
/**
 * Data attributes for the placeholder
 */

var placeholderData = _defineProperty({}, attributes.placeholder.contextId, '');

export var Placeholder = /*#__PURE__*/memo( /*#__PURE__*/forwardRef(function Placeholder(_ref, ref) {
  _objectDestructuringEmpty(_ref);

  var dimensions = useCapturedDimensions();
  var style = useMemo(function () {
    if (!dimensions) {
      return;
    }

    var margin = dimensions.margin,
        rect = dimensions.rect;
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