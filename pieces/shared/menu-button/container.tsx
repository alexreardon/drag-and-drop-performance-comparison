import {
  FocusEventHandler,
  PointerEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { css } from '@emotion/react';

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
  const isClosingMenuByClickingOnTrigger = useRef<boolean>(false);

  const focusContext = useContext(FocusContext);
  const isTriggerInitiallyFocused = entityId
    ? focusContext?.shouldFocus({ entityId: entityId })
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
    if (isClosingMenuByClickingOnTrigger.current) {
      isClosingMenuByClickingOnTrigger.current = false;
      return;
    }
    dispatch({ type: 'open', initialFocus });
  }, []);

  // give focus on the trigger if we need to
  useEffect(() => {
    if (!state.isMenuOpen && state.shouldGiveTriggerFocus) {
      triggerRef.current?.focus();
    }
  }, [state]);

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

  // Clicking on the Trigger while the Menu is open
  // will cause a 'blur' which will close the menu
  // The 'blur' event occurs before the 'click' event on the Trigger
  // The Trigger then responds to the 'click' and opens the menu
  // We need to block the Trigger from opening the menu
  const onPointerDown: PointerEventHandler = useCallback(
    (event) => {
      if (state.isMenuOpen && triggerRef.current?.contains(event.target as Node)) {
        isClosingMenuByClickingOnTrigger.current = true;
      }
    },
    [state.isMenuOpen],
  );

  return (
    <span css={containerStyles} onBlur={onBlur} onPointerDown={onPointerDown}>
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
