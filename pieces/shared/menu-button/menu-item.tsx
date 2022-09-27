import { FocusEventHandler, ReactNode, useCallback, useState } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const menuItemStyles = css({
  display: 'flex',
  padding: 8,
  margin: 0,
  ':hover': {
    background: token('color.background.neutral.subtle.hovered'),
  },
  ':active': {
    background: token('color.background.neutral.subtle.pressed'),
  },
});

const menuItemSelectedStyles = css({
  background: token('color.background.selected'),
  ':hover': {
    background: token('color.background.selected.hovered'),
  },
  ':active': {
    background: token('color.background.selected.pressed'),
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
      css={[menuItemStyles, hasFocus && menuItemSelectedStyles]}
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
