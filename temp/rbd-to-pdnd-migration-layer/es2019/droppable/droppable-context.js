import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';
const DroppableContext = /*#__PURE__*/createContext(null);
export const DroppableContextProvider = DroppableContext.Provider;
export function useDroppableContext() {
  const value = useContext(DroppableContext);
  invariant(value, 'Missing <Droppable /> parent');
  return value;
}