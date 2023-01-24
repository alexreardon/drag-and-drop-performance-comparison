export var directionMapping = {
  vertical: {
    mainAxis: {
      offset: 'offsetTop',
      length: 'offsetHeight',
      scrollOffset: 'scrollTop',
      forwardEdge: 'bottom',
      overflow: 'overflowY',
      style: {
        transform: 'translateY'
      }
    },
    crossAxis: {
      offset: 'offsetLeft',
      length: 'offsetWidth',
      style: {
        length: 'width',
        offset: 'left'
      }
    }
  },
  horizontal: {
    mainAxis: {
      offset: 'offsetLeft',
      length: 'offsetWidth',
      scrollOffset: 'scrollLeft',
      forwardEdge: 'right',
      overflow: 'overflowX',
      style: {
        transform: 'translateX'
      }
    },
    crossAxis: {
      offset: 'offsetTop',
      length: 'offsetHeight',
      style: {
        length: 'height',
        offset: 'top'
      }
    }
  }
};
/**
 * The thickness of the drop indicator line, in pixels.
 */

export var lineThickness = 2;
/**
 * The distance to pull the line back by, to account for its thickness.
 */

export var lineOffset = lineThickness / 2;