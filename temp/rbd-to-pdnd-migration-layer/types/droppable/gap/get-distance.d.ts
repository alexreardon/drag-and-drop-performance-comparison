import type { Direction } from 'react-beautiful-dnd';
/**
 * Computes the distance between two `DOMRect` instances.
 *
 * This is the shortest distance from the end of one to the start of the next.
 */
export declare function getDistance({ a, b, direction, }: {
    a: DOMRect;
    b: DOMRect;
    direction: Direction;
}): number;
