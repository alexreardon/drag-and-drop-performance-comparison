import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { useMemo } from 'react';
import { zIndex } from './constants';
var baseDraggingStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
  transition: 'none',
  zIndex: zIndex.dragging,
  opacity: 1,
  pointerEvents: 'none'
};
export function useDragPreview(dimensions, state) {
  var style = useMemo(function () {
    if (!state.isDragging || !state.location || !dimensions) {
      return undefined;
    }

    var rect = dimensions.rect;
    var location = state.location;
    var initial = location.initial,
        current = location.current;
    var translateX = rect.left + (current.input.clientX - initial.input.clientX);
    var translateY = rect.top + (current.input.clientY - initial.input.clientY);
    var isAtOrigin = translateX === 0 && translateY === 0;
    return _objectSpread(_objectSpread({}, baseDraggingStyle), {}, {
      transform: isAtOrigin ? undefined : "translate(".concat(translateX, "px, ").concat(translateY, "px)"),
      width: rect.width,
      height: rect.height
    });
  }, [dimensions, state]);
  return {
    style: style
  };
}