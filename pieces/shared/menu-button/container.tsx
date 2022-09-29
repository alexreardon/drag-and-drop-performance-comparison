import { ReactNode, useCallback, useEffect, useReducer, useRef } from 'react';

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

function reducer(state: MenuButtonState, action: MenuButtonAction): MenuButtonState {
  if (action.type === 'open') {
    return {
      isOpen: true,
      initialFocus: action.initialFocus,
    };
  }

  if (action.type === 'close') {
    return {
      isOpen: false,
      shouldResetFocus: action.shouldResetFocus,
    };
  }

  throw new Error('unreachable');
}

export const MenuButton = ({ label, children }: { label: string; children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, { isOpen: false, shouldResetFocus: true });

  const closeMenu = useCallback(({ shouldResetFocus }: { shouldResetFocus: boolean }) => {
    dispatch({ type: 'close', shouldResetFocus });
  }, []);

  const openMenu = useCallback(({ initialFocus }: { initialFocus: 'first' | 'last' }) => {
    dispatch({ type: 'open', initialFocus });
  }, []);

  const containerRef = useRef<HTMLSpanElement>(null);

  // Close the menu on outside clicks
  useEffect(() => {
    if (!state.isOpen) {
      return;
    }

    return bind(window, {
      type: 'click',
      listener: (event) => {
        // Ignore clicks inside, we only care about _outside_ clicks.
        if (containerRef.current?.contains(event.target as Node)) {
          return;
        }
        closeMenu({ shouldResetFocus: true });
      },
    });
  }, [closeMenu, state.isOpen]);

  return (
    <span css={containerStyles} ref={containerRef}>
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
