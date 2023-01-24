import React, { createContext, useCallback, useContext, useRef } from 'react';
import invariant from 'tiny-invariant';
import { combine } from '@atlaskit/drag-and-drop/util/combine';
export const emptyRegistry = {
  onPendingDragStart: [],
  onPendingDragUpdate: [],
  onBeforeDragEnd: []
};
export function useLifecycle() {
  const ref = useRef(emptyRegistry);
  const addResponder = useCallback((event, responder) => {
    const registry = ref.current;
    registry[event].push(responder);
    return () => {
      // FIXME:
      // @ts-expect-error
      registry[event] = registry[event].filter(value => value !== responder);
    };
  }, []);
  const dispatch = useCallback((event, data) => {
    const registry = ref.current;

    for (const responder of registry[event]) {
      responder(data);
    }
  }, []);
  return {
    addResponder,
    dispatch
  };
}
const LifecycleContext = /*#__PURE__*/createContext(null);
export function LifecycleContextProvider({
  children,
  lifecycle
}) {
  const monitorForLifecycle = useCallback(responders => {
    const cleanupFns = [];

    for (const [event, responder] of Object.entries(responders)) {
      if (!responder) {
        continue;
      } // FIXME:
      // @ts-expect-error


      cleanupFns.push(lifecycle.addResponder(event, responder));
    }

    return combine(...cleanupFns);
  }, [lifecycle]);
  return /*#__PURE__*/React.createElement(LifecycleContext.Provider, {
    value: monitorForLifecycle
  }, children);
}
export function useMonitorForLifecycle() {
  const monitorForLifecycle = useContext(LifecycleContext);
  invariant(monitorForLifecycle !== null, 'useLifecycle() should only be called inside of a <DragDropContext />');
  return monitorForLifecycle;
}