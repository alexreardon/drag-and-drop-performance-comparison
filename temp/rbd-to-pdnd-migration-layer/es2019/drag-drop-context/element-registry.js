import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
const ElementRegistryContext = /*#__PURE__*/createContext(null);
export function ElementRegistryProvider({
  children
}) {
  const registryRef = useRef({
    droppable: new Map()
  });
  const registerDroppable = useCallback(data => {}, []);
  return /*#__PURE__*/React.createElement(ElementRegistryContext.Provider, {
    value: {
      registerDroppable
    }
  }, children);
}
export function useDroppableRegistry({
  type,
  getElement
}) {
  const {
    registerDroppable
  } = useContext(ElementRegistryContext);
  useEffect(() => {}, []);
}