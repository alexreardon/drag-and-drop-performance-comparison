import type { DraggableLocation, MovementMode } from 'react-beautiful-dnd';
import type { DragLocationHistory } from '@atlaskit/drag-and-drop/types';
import type { CapturedDimensions } from './captured-dimensions-context';
export declare type DragState = {
    isDragging: false;
} | {
    isDragging: true;
    mode: MovementMode;
    capturedDimensions: CapturedDimensions;
    prevDestination: DraggableLocation | null;
};
export declare type DragController = {
    getDragState(): DragState;
    startDrag(args: {
        draggableId: string;
        type: string;
        getSourceLocation(): DraggableLocation;
        sourceElement: HTMLElement;
        location: DragLocationHistory | null;
        mode: MovementMode;
    }): void;
    updateDrag(args: {
        draggableId: string;
        type: string;
        sourceLocation: DraggableLocation;
        targetLocation: DraggableLocation | null;
    }): void;
    stopDrag(args: {
        draggableId: string;
        type: string;
        reason?: 'CANCEL' | 'DROP';
        sourceLocation: DraggableLocation;
        targetLocation: DraggableLocation | null;
    }): void;
};
