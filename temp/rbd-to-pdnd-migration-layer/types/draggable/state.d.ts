/**
 * All state for the Draggable is one place.
 *
 * This avoids rerenders (caused by unbatched state updates),
 * but also keeps state logic together.
 */
import type { DraggableLocation, DragStart, DroppableId, MovementMode } from 'react-beautiful-dnd';
import type { DragLocationHistory } from '@atlaskit/drag-and-drop/types';
import type { Action } from '../internal-types';
declare type DraggableIdleState = {
    isDragging: false;
    draggingOver: null;
};
declare type CursorPosition = {
    initial: {
        input: {
            clientX: number;
            clientY: number;
        };
    };
    current: {
        input: {
            clientX: number;
            clientY: number;
        };
    };
};
declare type DraggableDraggingState = {
    isDragging: true;
    draggingOver: DroppableId | null;
    start: DraggableLocation;
    location: CursorPosition | null;
    draggableId: string;
    mode: MovementMode;
};
export declare type DraggableState = DraggableIdleState | DraggableDraggingState;
export declare type DraggableAction = Action<'START_DRAG', {
    start: DragStart;
    location: DragLocationHistory | null;
}> | Action<'UPDATE_DRAG', {
    destination: DraggableLocation | null;
}> | Action<'UPDATE_CURSOR', {
    location: DragLocationHistory;
}> | Action<'DROP'>;
export declare const idleState: DraggableIdleState;
export declare function reducer(state: DraggableState, action: DraggableAction): DraggableState;
export {};
