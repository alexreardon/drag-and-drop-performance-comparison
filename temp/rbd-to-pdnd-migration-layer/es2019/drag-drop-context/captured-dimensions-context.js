import React, { createContext, useCallback, useContext } from 'react';
import invariant from 'tiny-invariant';
const CapturedDimensionsContext = /*#__PURE__*/createContext(null);
export function useCapturedDimensions() {
  const getCapturedDimensions = useContext(CapturedDimensionsContext);
  invariant(getCapturedDimensions !== null);
  return getCapturedDimensions();
}
export function CapturedDimensionsProvider({
  children,
  getDragState
}) {
  const getCapturedDimensions = useCallback(() => {
    const dragState = getDragState();

    if (!dragState.isDragging) {
      return null;
    }

    return dragState.capturedDimensions;
  }, [getDragState]);
  return /*#__PURE__*/React.createElement(CapturedDimensionsContext.Provider, {
    value: getCapturedDimensions
  }, children);
}