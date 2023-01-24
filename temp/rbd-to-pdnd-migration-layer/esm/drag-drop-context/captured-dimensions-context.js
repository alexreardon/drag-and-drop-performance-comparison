import React, { createContext, useCallback, useContext } from 'react';
import invariant from 'tiny-invariant';
var CapturedDimensionsContext = /*#__PURE__*/createContext(null);
export function useCapturedDimensions() {
  var getCapturedDimensions = useContext(CapturedDimensionsContext);
  invariant(getCapturedDimensions !== null);
  return getCapturedDimensions();
}
export function CapturedDimensionsProvider(_ref) {
  var children = _ref.children,
      getDragState = _ref.getDragState;
  var getCapturedDimensions = useCallback(function () {
    var dragState = getDragState();

    if (!dragState.isDragging) {
      return null;
    }

    return dragState.capturedDimensions;
  }, [getDragState]);
  return /*#__PURE__*/React.createElement(CapturedDimensionsContext.Provider, {
    value: getCapturedDimensions
  }, children);
}