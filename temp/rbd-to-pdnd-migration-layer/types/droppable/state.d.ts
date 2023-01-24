import type { DraggableLocation, DragStart, DragUpdate, DroppableId } from 'react-beautiful-dnd';
import type { Action } from '../internal-types';
declare type DroppableState = {
    draggingFromThisWith: string | null;
    draggingOverWith: string | null;
    isDraggingOver: boolean;
    source: DraggableLocation | null;
    destination: DraggableLocation | null;
    targetLocation: DraggableLocation | null;
};
export declare type DroppableAction = Action<'DRAG_START', {
    droppableId: DroppableId;
    start: DragStart;
}> | Action<'DRAG_UPDATE', {
    droppableId: DroppableId;
    targetLocation: DraggableLocation | null;
    update: DragUpdate;
}> | Action<'DRAG_CLEAR'>;
export declare const idleState: DroppableState;
export declare function reducer(state: DroppableState, action: DroppableAction): DroppableState;
export {};
