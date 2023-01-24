import type { DraggingStyle } from 'react-beautiful-dnd';
import type { CapturedDimensions } from '../drag-drop-context/captured-dimensions-context';
import type { DraggableState } from './state';
export declare function useDragPreview(dimensions: CapturedDimensions | null, state: DraggableState): {
    style: DraggingStyle | undefined;
};
