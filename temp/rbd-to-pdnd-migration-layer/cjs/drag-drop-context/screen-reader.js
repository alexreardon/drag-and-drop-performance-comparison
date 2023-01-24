"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "announce", {
  enumerable: true,
  get: function get() {
    return _dragAndDropLiveRegion.announce;
  }
});
exports.defaultMessage = void 0;
exports.getDefaultMessage = getDefaultMessage;
exports.getProvided = getProvided;

var _devWarning = require("../dev-warning");

var _dragAndDropLiveRegion = require("@atlaskit/drag-and-drop-live-region");

var defaultMessage = {
  onDragStart: function onDragStart(start) {
    var startPosition = start.source.index;
    return "You have lifted an item in position ".concat(startPosition, ".");
  },
  onDragUpdate: function onDragUpdate(_ref) {
    var source = _ref.source,
        destination = _ref.destination;

    if (!destination) {
      return 'You are currently not dragging over a droppable area';
    }

    var startPosition = source.index;
    var endPosition = destination.index;
    var isSameList = source.droppableId === destination.droppableId;

    if (isSameList) {
      return "You have moved the item from position ".concat(startPosition, " to position ").concat(endPosition);
    }

    return "You have moved the item from position ".concat(startPosition, " in list ").concat(source.droppableId, " to list ").concat(destination.droppableId, " in position ").concat(endPosition);
  },
  onDragEnd: function onDragEnd(_ref2) {
    var source = _ref2.source,
        destination = _ref2.destination,
        reason = _ref2.reason;
    var startPosition = source.index;

    if (reason === 'CANCEL') {
      return "Movement cancelled. The item has returned to its starting position of ".concat(startPosition);
    }

    if (!destination) {
      return "The item has been dropped while not over a droppable location. The item has returned to its starting position of ".concat(startPosition);
    }

    var endPosition = destination.index;
    var isSameList = source.droppableId === destination.droppableId;

    if (isSameList) {
      return "You have dropped the item. It has moved from position ".concat(startPosition, " to ").concat(endPosition);
    }

    return "You have dropped the item. It has moved from position ".concat(startPosition, " in list ").concat(source.droppableId, " to position ").concat(endPosition, " in list ").concat(destination.droppableId);
  }
};
exports.defaultMessage = defaultMessage;

function getDefaultMessage(event, data) {
  // @ts-expect-error - narrowing issue
  return defaultMessage[event](data);
}

function getProvided(event, data) {
  /**
   * The custom message to be used.
   */
  var userMessage = null;
  /**
   * Whether the message has been read yet.
   *
   * After it has been read, the user can no longer override it.
   */

  var hasExpired = false;
  var provided = {
    /**
     * Used to capture custom messages for screen readers.
     *
     * Does not announce directly, but exposes the message that should be
     * announced. This may or may not be the default message.
     */
    announce: function announce(message) {
      if (userMessage) {
        (0, _devWarning.warning)('Announcement already made. Not making a second announcement');
      }

      if (hasExpired) {
        (0, _devWarning.warning)("\n          Announcements cannot be made asynchronously.\n          Default message has already been announced.\n        ");
      }

      userMessage = message;
    }
  };
  /**
   * Returns the message that should be announced.
   */

  function getMessage() {
    var _userMessage;

    hasExpired = true;
    return (_userMessage = userMessage) !== null && _userMessage !== void 0 ? _userMessage : getDefaultMessage(event, data);
  }

  return {
    provided: provided,
    getMessage: getMessage
  };
}