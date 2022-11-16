import {
  FocusEventHandler,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { css } from '@emotion/react';
import { bind } from 'bind-event-listener';

import { FocusContext } from '../focus-context';
import Menu from './menu';
import Trigger from './trigger';

const containerStyles = css({
  display: 'flex',
  position: 'relative',
});

type MenuButtonState =
  | {
      isMenuOpen: true;
      initialFocus: 'first' | 'last';
    }
  | {
      isMenuOpen: false;
      shouldGiveTriggerFocus: boolean;
    };

type MenuButtonAction =
  | {
      type: 'open';
      initialFocus: 'first' | 'last';
    }
  | {
      type: 'close';
      shouldGiveTriggerFocus: boolean;
    };

function reducer(_: MenuButtonState, action: MenuButtonAction): MenuButtonState {
  if (action.type === 'open') {
    return {
      isMenuOpen: true,
      initialFocus: action.initialFocus,
    };
  }

  return {
    isMenuOpen: false,
    shouldGiveTriggerFocus: action.shouldGiveTriggerFocus,
  };
}

/**
 * Closes the menu if there is a click outside of it.
 */
function useCloseOnOutsideClick(
  ref: RefObject<HTMLUnknownElement>,
  {
    isMenuOpen,
    closeMenu,
  }: {
    isMenuOpen: boolean;
    closeMenu: ({ shouldGiveTriggerFocus }: { shouldGiveTriggerFocus: boolean }) => void;
  },
) {
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    return bind(window, {
      type: 'click',
      listener: (event) => {
        // Ignore clicks inside, we only care about _outside_ clicks.
        if (ref.current?.contains(event.target as Node)) {
          return;
        }
        closeMenu({ shouldGiveTriggerFocus: true });
      },
    });
  }, [closeMenu, isMenuOpen]);
}

export function MenuButton({
  label,
  children,
  entityId,
}: {
  label: string;
  entityId?: string;
  children: () => ReactNode;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  const focusContext = useContext(FocusContext);
  const isTriggerInitiallyFocused = entityId
    ? focusContext?.shouldFocus({ itemId: entityId })
    : false;

  const [state, dispatch] = useReducer(
    reducer,
    isTriggerInitiallyFocused
      ? { isMenuOpen: false, shouldGiveTriggerFocus: true }
      : { isMenuOpen: false, shouldGiveTriggerFocus: false },
  );

  const closeMenu = useCallback(
    ({ shouldGiveTriggerFocus }: { shouldGiveTriggerFocus: boolean }) => {
      dispatch({ type: 'close', shouldGiveTriggerFocus });
    },
    [],
  );

  const openMenu = useCallback(({ initialFocus }: { initialFocus: 'first' | 'last' }) => {
    dispatch({ type: 'open', initialFocus });
  }, []);

  // give focus on the trigger if we need to
  useEffect(() => {
    if (!state.isMenuOpen && state.shouldGiveTriggerFocus) {
      triggerRef.current?.focus();
    }
  }, [state.isMenuOpen]);

  const onBlur: FocusEventHandler = useCallback(
    (event) => {
      // bluring to something in the menu, we can keep the menu open
      if (menuRef.current?.contains(event.relatedTarget)) {
        return;
      }

      // bluring to the trigger, or outside the trigger
      // we need to close the menu
      dispatch({ type: 'close', shouldGiveTriggerFocus: false });
    },
    [state.isMenuOpen],
  );

  return (
    <span css={containerStyles} onBlur={onBlur}>
      <Trigger
        ref={triggerRef}
        isMenuOpen={state.isMenuOpen}
        closeMenu={() => closeMenu({ shouldGiveTriggerFocus: true })}
        label={label}
        openMenu={openMenu}
      />
      {state.isMenuOpen && (
        <Menu ref={menuRef} onClose={closeMenu} initialFocus={state.initialFocus}>
          {children()}
        </Menu>
      )}
    </span>
  );
}

export default MenuButton;
