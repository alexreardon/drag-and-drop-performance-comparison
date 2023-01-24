import type { DraggableLocation } from 'react-beautiful-dnd';
export declare function getDestination({ start, target, }: {
    /**
     * The start location of the draggable.
     */
    start: DraggableLocation;
    /**
     * Where the mouse is hovered over.
     */
    target: DraggableLocation | null;
}): DraggableLocation | null;
