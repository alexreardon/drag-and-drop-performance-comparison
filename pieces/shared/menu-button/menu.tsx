import {
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useRef,
} from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { fallbackColor } from '../fallback';

type MenuProps = {
  children: ReactNode;
  onKeyDown: KeyboardEventHandler;
  onClose: (args: { shouldResetFocus: boolean }) => void;
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

const Menu = forwardRef<HTMLUListElement, MenuProps>(function Menu(
  { children, onKeyDown: onKeydownProp, onClose },
  ref,
) {
  const internalRef = useRef<HTMLUListElement>(null);

  const onKeyDown: KeyboardEventHandler = useCallback(
    (event) => {
      onKeydownProp(event);

      if (event.key === 'Enter' || event.key === ' ') {
        onClose({ shouldResetFocus: true });
      }
    },
    [onKeydownProp, onClose],
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
      if (!internalRef.current) {
        return;
      }
      if (internalRef.current.contains(event.relatedTarget)) {
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
