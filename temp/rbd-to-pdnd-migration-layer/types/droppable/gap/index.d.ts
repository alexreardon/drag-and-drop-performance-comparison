import type { Direction } from 'react-beautiful-dnd';
/**
 * ASSUMPTIONS:
 * - Adjacent `<Draggable>` items are visually adjacent.
 * - If there is an adjacent element, it is rendered.
 */
export declare function calculateGap({ element, where, direction, }: {
    element: HTMLElement;
    where: 'before' | 'after';
    direction: Direction;
}): number;
export declare function getGapOffset({ element, where, direction, }: {
    element: HTMLElement;
    where: 'before' | 'after';
    direction: Direction;
}): number;
