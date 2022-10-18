import { ReactNode, RefObject, useCallback, useEffect, useReducer, useRef } from 'react';

import { css } from '@emotion/react';
import { bind } from 'bind-event-listener';

import Trigger from './trigger';
import Menu from './menu';

const containerStyles = css({
  display: 'flex',
  position: 'relative',
});

type MenuButtonState =
  | {
      isOpen: true;
      initialFocus: 'first' | 'last';
    }
  | {
      isOpen: false;
      shouldResetFocus: boolean;
    };

type MenuButtonAction =
  | {
      type: 'open';
      initialFocus: 'first' | 'last';
    }
  | {
      type: 'close';
      shouldResetFocus: boolean;
    };

function reducer(_: MenuButtonState, action: MenuButtonAction): MenuButtonState {
  if (action.type === 'open') {
    return {
      isOpen: true,
      initialFocus: action.initialFocus,
    };
  }

  return {
    isOpen: false,
    shouldResetFocus: action.shouldResetFocus,
  };
}

/**
 * Closes the menu if there is a click outside of it.
 */
function useCloseOnOutsideClick(
  ref: RefObject<HTMLUnknownElement>,
  {
    isOpen,
    closeMenu,
  }: { isOpen: boolean; closeMenu: ({ shouldResetFocus }: { shouldResetFocus: boolean }) => void },
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    return bind(window, {
      type: 'click',
      listener: (event) => {
        // Ignore clicks inside, we only care about _outside_ clicks.
        if (ref.current?.contains(event.target as Node)) {
          return;
        }
        closeMenu({ shouldResetFocus: true });
      },
    });
  }, [closeMenu, isOpen, ref]);
}

export const MenuButton = ({ label, children }: { label: string; children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { isOpen: false, shouldResetFocus: false });

  const ref = useRef<HTMLSpanElement>(null);

  const closeMenu = useCallback(({ shouldResetFocus }: { shouldResetFocus: boolean }) => {
    dispatch({ type: 'close', shouldResetFocus });
  }, []);

  const openMenu = useCallback(({ initialFocus }: { initialFocus: 'first' | 'last' }) => {
    dispatch({ type: 'open', initialFocus });
  }, []);

  useCloseOnOutsideClick(ref, { isOpen: state.isOpen, closeMenu });

  return (
    <span css={containerStyles} ref={ref}>
      <Trigger
        isOpen={state.isOpen}
        shouldResetFocus={state.isOpen ? false : state.shouldResetFocus}
        label={label}
        openMenu={openMenu}
      />
      {state.isOpen && (
        <Menu onClose={closeMenu} initialFocus={state.initialFocus}>
          {children}
        </Menu>
      )}
    </span>
  );
};

export default MenuButton;
