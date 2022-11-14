import { Context, useContext } from 'react';
import invariant from 'tiny-invariant';

export function useRequiredContext<T>(context: Context<T | null>): T {
  const value = useContext(context);
  invariant(value);
  return value;
}
