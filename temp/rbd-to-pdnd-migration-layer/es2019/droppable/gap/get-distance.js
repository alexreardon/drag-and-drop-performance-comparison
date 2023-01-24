const directionMapping = {
  horizontal: {
    rect: {
      start: 'left',
      end: 'right'
    }
  },
  vertical: {
    rect: {
      start: 'top',
      end: 'bottom'
    }
  }
};
/**
 * Computes the distance between two `DOMRect` instances.
 *
 * This is the shortest distance from the end of one to the start of the next.
 */

export function getDistance({
  a,
  b,
  direction
}) {
  const {
    rect
  } = directionMapping[direction];
  return Math.max(a[rect.start], b[rect.start]) - Math.min(a[rect.end], b[rect.end]);
}