import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
var ElementRegistryContext = /*#__PURE__*/createContext(null);
export function ElementRegistryProvider(_ref) {
  var children = _ref.children;
  var registryRef = useRef({
    droppable: new Map()
  });
  var registerDroppable = useCallback(function (data) {}, []);
  return /*#__PURE__*/React.createElement(ElementRegistryContext.Provider, {
    value: {
      registerDroppable: registerDroppable
    }
  }, children);
}
export function useDroppableRegistry(_ref2) {
  var type = _ref2.type,
      getElement = _ref2.getElement;

  var _useContext = useContext(ElementRegistryContext),
      registerDroppable = _useContext.registerDroppable;

  useEffect(function () {}, []);
}