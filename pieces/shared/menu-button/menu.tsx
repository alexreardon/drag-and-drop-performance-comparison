import {
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
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

const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu({
  children,
  onClose,
  initialFocus,
}) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (initialFocus === 'first') {
      focusFirstItem(ref.current);
    }

    if (initialFocus === 'last') {
      focusLastItem(ref.current);
    }
  }, [initialFocus]);

  const onKeyDown: KeyboardEventHandler = useCallback(
    (event) => {
      if (ref.current === null) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        onClose({ shouldResetFocus: true });
      }

      if (event.key === 'Escape') {
        onClose({ shouldResetFocus: true });
      }

      if (event.key === 'ArrowDown') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusNextItem(ref.current);
      }

      if (event.key === 'ArrowUp') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusPrevItem(ref.current);
      }

      if (event.key === 'Home') {
        focusFirstItem(ref.current);
      }

      if (event.key === 'End') {
        focusLastItem(ref.current);
      }

      if (!/[a-z]/i.test(event.key)) {
        focusNextMatch(ref.current, event.key);
      }
    },
    [onClose],
  );

  const onClick: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();
      onClose({ shouldResetFocus: true });
    },
    [onClose],
  );

  const onBlur: FocusEventHandler = useCallback(
    (event) => {
      if (!ref.current) {
        return;
      }
      if (ref.current.contains(event.relatedTarget)) {
        return;
      }

      onClose({ shouldResetFocus: false });
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
});

export default Menu;
