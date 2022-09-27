import {
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { fallbackColor } from '../fallback';

type MenuProps = { children: ReactNode; onKeyDown: KeyboardEventHandler };

export type MenuHandle = {
  focusFirst(): void;
  focusLast(): void;
  focusNext(): void;
  focusPrev(): void;
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

const stopPropagation: MouseEventHandler = (event) => {
  event.stopPropagation();
};

const Menu = forwardRef<MenuHandle, MenuProps>(function Menu({ children, onKeyDown }, handleRef) {
  const internalRef = useRef<HTMLUListElement>(null);

  useImperativeHandle(
    handleRef,
    () => {
      return {
        internal: internalRef,
        focusFirst() {
          const firstElementChild = internalRef.current?.firstElementChild as HTMLElement;
          firstElementChild.focus();
        },
        focusLast() {
          const lastElementChild = internalRef.current?.lastElementChild as HTMLElement;
          lastElementChild.focus();
        },
        focusNext() {
          const active = internalRef.current?.querySelector('[tabindex="0"]');

          let next = active?.nextElementSibling as HTMLElement;
          if (next === null) {
            next = internalRef.current?.firstElementChild as HTMLElement;
          }

          next.focus();
        },
        focusPrev() {
          const active = internalRef.current?.querySelector('[tabindex="0"]');

          let prev = active?.previousElementSibling as HTMLElement;
          if (prev === null) {
            prev = internalRef.current?.lastElementChild as HTMLElement;
          }

          prev?.focus();
        },
      };
    },
    [internalRef],
  );

  return (
    <ul
      role="menu"
      css={menuStyles}
      ref={internalRef}
      onKeyDown={onKeyDown}
      onClick={stopPropagation}
    >
      {children}
    </ul>
  );
});

export default Menu;
