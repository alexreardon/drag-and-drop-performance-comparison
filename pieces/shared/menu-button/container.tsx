import {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { css } from '@emotion/react';
import { bind } from 'bind-event-listener';

import Trigger from './trigger';
import Menu from './menu';
import {
  focusFirstItem,
  focusLastItem,
  focusNextItem,
  focusPrevItem,
  focusNextMatch,
} from './focus';

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

  const initialFocusRef = useRef<'first' | 'last'>('first');

  const menuRef = useRef<HTMLUListElement>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  /**
   * Handles moving focus back to the trigger on menu close.
   *
   * Not all closures should move focus back,
   * so this ref allows for choosing when it happens.
   */
  useEffect(() => {
    if (!state.isOpen && state.shouldResetFocus) {
      triggerRef.current?.focus();
    }
  }, [state]);

  const closeMenu = useCallback(({ shouldResetFocus }: { shouldResetFocus: boolean }) => {
    dispatch({ type: 'close', shouldResetFocus });
  }, []);

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback((event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      dispatch({ type: 'open', initialFocus: 'first' });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      dispatch({ type: 'open', initialFocus: 'last' });
    }
  }, []);

  useEffect(() => {
    if (!state.isOpen) {
      return;
    }

    if (state.initialFocus === 'first') {
      focusFirstItem(menuRef.current);
    }

    if (state.initialFocus === 'last') {
      focusLastItem(menuRef.current);
    }
  }, [state]);

  const containerRef = useRef<HTMLSpanElement>(null);

  const onMenuKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (containerRef.current === null) {
        return;
      }

      if (event.key === 'Escape') {
        closeMenu({ shouldResetFocus: true });
      }

      if (event.key === 'ArrowDown') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusNextItem(menuRef.current);
      }

      if (event.key === 'ArrowUp') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusPrevItem(menuRef.current);
      }

      if (event.key === 'Home') {
        focusFirstItem(menuRef.current);
      }

      if (event.key === 'End') {
        focusLastItem(menuRef.current);
      }

      if (!/[a-z]/i.test(event.key)) {
        focusNextMatch(containerRef.current, event.key);
      }
    },
    [closeMenu],
  );

  useEffect(() => {
    if (!state.isOpen) {
      return;
    }

    return bind(window, {
      type: 'click',
      listener: () => {
        closeMenu({ shouldResetFocus: true });
      },
    });
  }, [closeMenu, state.isOpen]);

  const onClick: MouseEventHandler = useCallback((event) => {
    dispatch({
      type: 'open',
      initialFocus: 'first',
    });
    event.stopPropagation();
  }, []);

  return (
    <span css={containerStyles} ref={containerRef}>
      <Trigger
        ref={triggerRef}
        isOpen={state.isOpen}
        label={label}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
      {state.isOpen && (
        <Menu ref={menuRef} onKeyDown={onMenuKeyDown} onClose={closeMenu}>
          {children}
        </Menu>
      )}
    </span>
  );
};

export default MenuButton;
