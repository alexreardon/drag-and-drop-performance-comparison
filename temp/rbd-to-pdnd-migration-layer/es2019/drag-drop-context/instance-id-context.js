import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';
export const InstanceIdContext = /*#__PURE__*/createContext(null);
export function useInstanceId() {
  const value = useContext(InstanceIdContext);
  invariant(value, 'Has <DragDropContext /> as ancestor.');
  return value;
}