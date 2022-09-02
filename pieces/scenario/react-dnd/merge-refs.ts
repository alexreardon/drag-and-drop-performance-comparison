import { MutableRefObject, Ref, RefObject } from 'react';

type Refs =
  | Ref<HTMLElement | null>
  | RefObject<HTMLElement | null>
  | ((node: HTMLElement | null) => void);

/**
 * Assigns the node to all the refs passed in the argument.
 *
 * @param refs: An array of refs (as function or ref object)
 */
export default function mergeRefs(refs: Refs[]) {
  return (value: HTMLElement | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        (ref as MutableRefObject<HTMLElement | null>).current = value;
      }
    });
  };
}
