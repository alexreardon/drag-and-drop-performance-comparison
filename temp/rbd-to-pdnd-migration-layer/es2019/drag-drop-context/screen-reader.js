import { warning } from '../dev-warning';
export const defaultMessage = {
  onDragStart(start) {
    const startPosition = start.source.index;
    return `You have lifted an item in position ${startPosition}.`;
  },

  onDragUpdate({
    source,
    destination
  }) {
    if (!destination) {
      return 'You are currently not dragging over a droppable area';
    }

    const startPosition = source.index;
    const endPosition = destination.index;
    const isSameList = source.droppableId === destination.droppableId;

    if (isSameList) {
      return `You have moved the item from position ${startPosition} to position ${endPosition}`;
    }

    return `You have moved the item from position ${startPosition} in list ${source.droppableId} to list ${destination.droppableId} in position ${endPosition}`;
  },

  onDragEnd({
    source,
    destination,
    reason
  }) {
    const startPosition = source.index;

    if (reason === 'CANCEL') {
      return `Movement cancelled. The item has returned to its starting position of ${startPosition}`;
    }

    if (!destination) {
      return `The item has been dropped while not over a droppable location. The item has returned to its starting position of ${startPosition}`;
    }

    const endPosition = destination.index;
    const isSameList = source.droppableId === destination.droppableId;

    if (isSameList) {
      return `You have dropped the item. It has moved from position ${startPosition} to ${endPosition}`;
    }

    return `You have dropped the item. It has moved from position ${startPosition} in list ${source.droppableId} to position ${endPosition} in list ${destination.droppableId}`;
  }

};
export function getDefaultMessage(event, data) {
  // @ts-expect-error - narrowing issue
  return defaultMessage[event](data);
}
export function getProvided(event, data) {
  /**
   * The custom message to be used.
   */
  let userMessage = null;
  /**
   * Whether the message has been read yet.
   *
   * After it has been read, the user can no longer override it.
   */

  let hasExpired = false;
  const provided = {
    /**
     * Used to capture custom messages for screen readers.
     *
     * Does not announce directly, but exposes the message that should be
     * announced. This may or may not be the default message.
     */
    announce(message) {
      if (userMessage) {
        warning('Announcement already made. Not making a second announcement');
      }

      if (hasExpired) {
        warning(`
          Announcements cannot be made asynchronously.
          Default message has already been announced.
        `);
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
    provided,
    getMessage
  };
}
export { announce } from '@atlaskit/drag-and-drop-live-region';