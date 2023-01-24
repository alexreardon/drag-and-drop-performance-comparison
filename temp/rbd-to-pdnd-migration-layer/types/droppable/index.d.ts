/// <reference types="react" />
import type { DroppableProps } from 'react-beautiful-dnd';
declare type ExtendedDroppableProps = DroppableProps & {};
export declare function Droppable({ children, droppableId, type, // This default value replicates `react-beautiful-dnd`,
direction, mode, renderClone, getContainerForClone, isDropDisabled, }: ExtendedDroppableProps): JSX.Element;
export {};
