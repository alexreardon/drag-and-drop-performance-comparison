import type { DraggableLocation } from 'react-beautiful-dnd';
import type { DragLocation } from '@atlaskit/drag-and-drop/types';
/**
 * Derives a `DraggableLocation` (`react-beautiful-dnd`)
 * from a `DragLocation` (`@atlaskit/drag-and-drop`).
 */
export declare function getDraggableLocation(location: DragLocation): DraggableLocation | null;
/**
 * Checks if two `DraggableLocation` values are equivalent.
 */
export declare function isSameLocation(a: DraggableLocation | null, b: DraggableLocation | null): boolean;
