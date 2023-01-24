import { jsx } from '@emotion/react';
import type { Direction, DraggableLocation, DroppableMode } from 'react-beautiful-dnd';
declare type DropIndicatorProps = {
  direction: Direction;
  mode: DroppableMode;
  source: DraggableLocation;
  destination: DraggableLocation | null;
  targetLocation: DraggableLocation | null;
};
export declare const DropIndicator: ({
  direction,
  mode,
  source,
  destination,
  targetLocation,
}: DropIndicatorProps) => jsx.JSX.Element;
export {};
