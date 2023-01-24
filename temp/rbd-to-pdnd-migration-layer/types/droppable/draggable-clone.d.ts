/// <reference types="react" />
import type { DraggableChildrenFn, DroppableId } from 'react-beautiful-dnd';
/**
 * Wrapper that is always rendered if there is a `renderClone` function.
 *
 * It sets up a monitor, and needs to observe the entire lifecycle.
 */
export declare function DraggableClone({ children, droppableId, type, getContainerForClone, }: {
    children: DraggableChildrenFn;
    droppableId: DroppableId;
    type: string;
    getContainerForClone?: () => HTMLElement;
}): JSX.Element | null;
