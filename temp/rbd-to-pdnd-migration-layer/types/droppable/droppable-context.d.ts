/// <reference types="react" />
import type { Direction } from 'react-beautiful-dnd';
export declare type DroppableContextProps = {
    direction: Direction;
    droppableId: string;
    hasRenderClone: boolean;
    isDropDisabled: boolean;
    type: string;
};
export declare const DroppableContextProvider: import("react").Provider<DroppableContextProps | null>;
export declare function useDroppableContext(): DroppableContextProps;
