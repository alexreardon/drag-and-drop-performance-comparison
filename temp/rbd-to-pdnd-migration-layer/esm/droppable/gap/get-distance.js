var directionMapping = {
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

export function getDistance(_ref) {
  var a = _ref.a,
      b = _ref.b,
      direction = _ref.direction;
  var rect = directionMapping[direction].rect;
  return Math.max(a[rect.start], b[rect.start]) - Math.min(a[rect.end], b[rect.end]);
}