import {
  FocusEventHandler,
  forwardRef,
  KeyboardEvent,
  MouseEventHandler,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { fallbackColor } from '../fallback';
import {
  focusNextItem,
  focusPrevItem,
  focusFirstItem,
  focusLastItem,
  focusNextMatch,
} from './focus';

type MenuProps = {
  children: ReactNode;
  onClose: (args: { shouldResetFocus: boolean }) => void;
  initialFocus: 'first' | 'last';
};

const menuStyles = css({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  background: token('elevation.surface.overlay', fallbackColor),
  boxShadow: token('elevation.shadow.overlay', fallbackColor),
  minWidth: 128,
  minHeight: 48,
  width: 'max-content',
  zIndex: 1,
  top: 'calc(100% + 8px)',
  borderRadius: 3,
  right: 0,
  listStyleType: 'none',
  padding: 0,
  margin: 0,
});

/**
 * Will move the initial focus to the first or last menu item.
 * The initially focused item depends on which key was used to open the menu.
 */
function useInitialFocus(menuRef: RefObject<HTMLUListElement>, initialFocus: 'first' | 'last') {
  useEffect(() => {
    if (initialFocus === 'first') {
      focusFirstItem(menuRef.current);
    }

    if (initialFocus === 'last') {
      focusLastItem(menuRef.current);
    }
  }, [initialFocus, menuRef]);
}

function Menu({ children, onClose, initialFocus }: MenuProps) {
  const ref = useRef<HTMLUListElement>(null);

  useInitialFocus(ref, initialFocus);

  /**
   * When the menu loses focus it should close.
   */
  const onBlur: FocusEventHandler = useCallback(
    (event) => {
      if (!ref.current) {
        return;
      }

      if (ref.current.contains(event.relatedTarget)) {
        return;
      }

      // The menu might blur because e.g. you tab to the next button on the page.
      // That means resetting focus would be a bad thing.
      onClose({ shouldResetFocus: false });
    },
    [onClose],
  );

  /**
   * Clicking a menu item should close the menu,
   * and return focus to the trigger.
   */
  const onClick: MouseEventHandler = useCallback(() => {
    onClose({ shouldResetFocus: true });
  }, [onClose]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (ref.current === null) {
        return;
      }

      // The enter and space keys trigger the focused action,
      // and close the menu.
      if (event.key === 'Enter' || event.key === ' ') {
        // cancelling scrolling
        event.preventDefault();
        onClose({ shouldResetFocus: true });
      }

      // Escape closes the menu, without triggering any action.
      if (event.key === 'Escape') {
        onClose({ shouldResetFocus: true });
      }

      // Moves focus to the next item, wrapping around to the start if necessary.
      if (event.key === 'ArrowDown') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusNextItem(ref.current);
      }

      // Moves focus to the previous item, wrapping around to the end if necessary.
      if (event.key === 'ArrowUp') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusPrevItem(ref.current);
      }

      // Moves focus to the first item.
      if (event.key === 'Home') {
        focusFirstItem(ref.current);
      }

      // Moves focus to the last item.
      if (event.key === 'End') {
        focusLastItem(ref.current);
      }

      // Selects the next item which starts with the pressed letter.
      if (/[a-z]/i.test(event.key)) {
        focusNextMatch(ref.current, event.key);
      }
    },
    [onClose],
  );

  return (
    <ul
      role="menu"
      css={menuStyles}
      ref={ref}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onBlur={onBlur}
    >
      {children}
    </ul>
  );
}

export default Menu;
