import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';
export var InstanceIdContext = /*#__PURE__*/createContext(null);
export function useInstanceId() {
  var value = useContext(InstanceIdContext);
  invariant(value, 'Has <DragDropContext /> as ancestor.');
  return value;
}