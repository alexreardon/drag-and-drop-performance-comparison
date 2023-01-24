import { useMemo } from 'react';
import { zIndex } from './constants';
const baseDraggingStyle = {
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
  const style = useMemo(() => {
    if (!state.isDragging || !state.location || !dimensions) {
      return undefined;
    }

    const {
      rect
    } = dimensions;
    const {
      location
    } = state;
    const {
      initial,
      current
    } = location;
    const translateX = rect.left + (current.input.clientX - initial.input.clientX);
    const translateY = rect.top + (current.input.clientY - initial.input.clientY);
    const isAtOrigin = translateX === 0 && translateY === 0;
    return { ...baseDraggingStyle,
      transform: isAtOrigin ? undefined : `translate(${translateX}px, ${translateY}px)`,
      width: rect.width,
      height: rect.height
    };
  }, [dimensions, state]);
  return {
    style
  };
}