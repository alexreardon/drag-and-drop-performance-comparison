import {
  FocusEventHandler,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactEventHandler,
  ReactNode,
  UIEvent,
  useCallback,
  useState,
} from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const menuItemStyles = css({
  display: 'flex',
  padding: 'var(--grid)',
  margin: 0,
  ':hover': {
    background: token('color.background.neutral.subtle.hovered'),
  },
  ':active': {
    background: token('color.background.neutral.subtle.pressed'),
  },
});

export const MenuItem = ({
  children,
  onAction,
}: {
  children: ReactNode | ReactNode[];
  onAction?: (event: UIEvent) => void;
}) => {
  const [hasFocus, setHasFocus] = useState(false);

  const onFocus = useCallback(() => {
    setHasFocus(true);
  }, []);

  const onBlur: FocusEventHandler = useCallback((event) => {
    if (event.relatedTarget === null) {
      return;
    }

    setHasFocus(false);
  }, []);

  const onKeyDown: KeyboardEventHandler = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onAction?.(event);
      }
    },
    [onAction],
  );

  return (
    <li
      css={menuItemStyles}
      role="menuitem"
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onAction}
      onKeyDown={onKeyDown}
      tabIndex={hasFocus ? 0 : -1}
    >
      {children}
    </li>
  );
};

export default MenuItem;
