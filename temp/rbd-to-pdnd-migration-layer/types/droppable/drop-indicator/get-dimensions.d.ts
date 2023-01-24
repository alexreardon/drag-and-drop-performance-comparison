import type { Direction, DraggableLocation, DroppableMode } from 'react-beautiful-dnd';
import type { IndicatorDimensions } from './types';
export declare function getDimensions({ targetLocation, direction, mode, }: {
    targetLocation: DraggableLocation;
    direction: Direction;
    mode: DroppableMode;
}): IndicatorDimensions | null;
