import { FocusEventHandler, ReactNode, useCallback, useState } from 'react';

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

export const MenuItem = ({ children }: { children: ReactNode }) => {
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

  return (
    <li
      css={menuItemStyles}
      role="menuitem"
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={hasFocus ? 0 : -1}
    >
      {children}
    </li>
  );
};

export default MenuItem;
