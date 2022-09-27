import { createContext, useContext } from 'react';

export type FocusContextProps = {
  hasFocusLock: boolean;
  setHasFocusLock: (hasFocusLock: boolean) => void;
};

const FocusContext = createContext<FocusContextProps>({
  hasFocusLock: true,
  setHasFocusLock: () => {},
});

export const FocusContextProvider = FocusContext.Provider;

export const useFocusContext = () => {
  return useContext(FocusContext);
};
