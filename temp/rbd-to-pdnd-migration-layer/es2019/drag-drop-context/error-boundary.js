import React, { useCallback, useEffect, useRef } from 'react';
import { bind } from 'bind-event-listener';
import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
import { cancelDrag } from './cancel-drag';

/**
 * This component holds the actual error boundary logic.
 */
function ErrorBoundaryInner({
  children
}) {
  const isDraggingRef = useRef(false);
  const handleWindowError = useCallback(() => {
    if (isDraggingRef.current) {
      cancelDrag(); // warning(`
      //   An error was caught by our window 'error' event listener while a drag was occurring.
      //   The active drag has been aborted.
      // `);
    } // TODO: handle RBDInvariant
    // const err: Error = event.error;
    // if (err instanceof RbdInvariant) {
    //   // Marking the event as dealt with.
    //   // This will prevent any 'uncaught' error warnings in the console
    //   event.preventDefault();
    //   if (process.env.NODE_ENV !== 'production') {
    //     error(err.message);
    //   }
    // }

  }, []);
  useEffect(() => {
    return combine(monitorForElements({
      onDragStart() {
        isDraggingRef.current = true;
      },

      onDrop() {
        isDraggingRef.current = false;
      }

    }), bind(window, {
      type: 'error',
      listener: handleWindowError
    }));
  }, [handleWindowError]);
  return children;
}
/**
 * Cancels drags when errors occur.
 */
// We have to use a class component to create an error boundary
// eslint-disable-next-line @repo/internal/react/no-class-components


export class ErrorBoundary extends React.Component {
  componentDidCatch(err) {
    // TODO: handle RBDInvariant
    // if (err instanceof RbdInvariant) {
    //   if (process.env.NODE_ENV !== 'production') {
    //     error(err.message);
    //   }
    //   this.setState({});
    //   return;
    // }
    // throwing error for other error boundaries
    throw err;
  }

  render() {
    return /*#__PURE__*/React.createElement(ErrorBoundaryInner, {
      instanceId: this.props.instanceId
    }, this.props.children);
  }

}