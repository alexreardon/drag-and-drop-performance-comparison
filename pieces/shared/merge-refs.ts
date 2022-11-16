import { MutableRefObject, Ref, RefObject } from 'react';

type Refs<Value> = Ref<Value | null> | RefObject<Value | null> | ((node: Value | null) => void);

/**
 * Assigns the node to all the refs passed in the argument.
 *
 * @param refs: An array of refs (as function or ref object)
 */
export default function mergeRefs<Value>(refs: Refs<Value>[]) {
  return (value: Value | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        (ref as MutableRefObject<Value | null>).current = value;
      }
    });
  };
}
