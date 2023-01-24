import { ReactElement, ReactNode } from 'react';
import type { DragDropContextProps } from 'react-beautiful-dnd';
export declare function DragDropContext({ children, onBeforeCapture, onBeforeDragStart, onDragStart, onDragUpdate, onDragEnd, }: DragDropContextProps & {
    children?: ReactNode;
}): ReactElement;
