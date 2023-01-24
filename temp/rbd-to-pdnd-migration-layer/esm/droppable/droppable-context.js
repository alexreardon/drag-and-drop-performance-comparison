import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';
var DroppableContext = /*#__PURE__*/createContext(null);
export var DroppableContextProvider = DroppableContext.Provider;
export function useDroppableContext() {
  var value = useContext(DroppableContext);
  invariant(value, 'Missing <Droppable /> parent');
  return value;
}