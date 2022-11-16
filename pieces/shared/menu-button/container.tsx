import {
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
import { useRequiredContext } from '../use-required-context';
import Menu from './menu';
import Trigger from './trigger';

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

export function MenuButton({
  label,
  children,
  entityId,
}: {
  label: string;
  entityId?: string;
  children: () => ReactNode;
}) {
  const focusContext = useContext(FocusContext);
  const isOpenToStart = entityId ? focusContext?.shouldFocus({ itemId: entityId }) : false;

  const [state, dispatch] = useReducer(
    reducer,
    isOpenToStart
      ? { isOpen: false, shouldResetFocus: true }
      : { isOpen: false, shouldResetFocus: false },
  );
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
          {children()}
        </Menu>
      )}
    </span>
  );
}

export default MenuButton;
