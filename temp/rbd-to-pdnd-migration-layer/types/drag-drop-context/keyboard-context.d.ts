import { ReactNode } from 'react';
import type { DraggableLocation } from 'react-beautiful-dnd';
import { DragController } from './types';
declare type KeyboardContextProps = {
    startKeyboardDrag({}: {
        draggableId: string;
        type: string;
        getSourceLocation(): DraggableLocation;
        sourceElement: HTMLElement;
    }): void;
};
export declare function useKeyboardContext(): KeyboardContextProps;
export declare function KeyboardContextProvider({ children, dragController, }: {
    children: ReactNode;
    dragController: DragController;
}): JSX.Element;
export {};
