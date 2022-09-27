import {
  FocusEventHandler,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Button from './button';
import { fallbackColor } from './fallback';
import moreIcon from './more.svg';
import { useFocusContext } from './focus-context';

const panelStyles = css({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  background: token('elevation.surface.overlay', fallbackColor),
  boxShadow: token('elevation.shadow.overlay', fallbackColor),
  minWidth: 48,
  minHeight: 48,
  zIndex: 1,
  top: 'calc(100% + 8px)',
  borderRadius: 3,
  right: 0,
  listStyleType: 'none',
  padding: 0,
  margin: 0,
});

type MenuProps = { children: ReactNode; onKeyDown: KeyboardEventHandler };

type MenuHandle = {
  focusFirst(): void;
  focusLast(): void;
  focusNext(): void;
  focusPrev(): void;
};

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
      css={panelStyles}
      ref={internalRef}
      onKeyDown={onKeyDown}
      onClick={stopPropagation}
    >
      {children}
    </ul>
  );
});

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

const containerStyles = css({
  display: 'flex',
  position: 'relative',
});

export const MenuButton = ({ label, children }: { label: string; children: ReactNode }) => {
  const [isOpen, toggleIsOpen] = useReducer((isOpen) => !isOpen, false);

  const [initialFocus, setInitialFocus] = useState<'first' | 'last'>('first');

  const menuRef = useRef<MenuHandle>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback((event) => {
    switch (event.key) {
      case 'ArrowDown':
        toggleIsOpen();
        setInitialFocus('first');
        break;

      case 'ArrowUp':
        toggleIsOpen();
        setInitialFocus('last');
        break;
    }
  }, []);

  useEffect(() => {
    if (isOpen === false) {
      setInitialFocus('first');
      return;
    }

    if (initialFocus === 'first') {
      menuRef.current?.focusFirst();
    }

    if (initialFocus === 'last') {
      menuRef.current?.focusLast();
    }
  }, [initialFocus, isOpen]);

  const containerRef = useRef<HTMLSpanElement>(null);

  const onMenuKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback((event) => {
    switch (event.key) {
      case 'Escape':
        toggleIsOpen();
        return;

      case 'ArrowDown':
        menuRef.current?.focusNext();
        return;

      case 'ArrowUp':
        menuRef.current?.focusPrev();
        break;

      case 'Home':
        menuRef.current?.focusFirst();
        break;

      case 'End':
        menuRef.current?.focusLast();
        break;
    }

    // TODO: select next, not just first
    if (containerRef.current && /[a-z]/i.test(event.key)) {
      const letter = event.key.toLowerCase();

      const items = containerRef.current.querySelectorAll('li');

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.textContent?.toLowerCase().startsWith(letter)) {
          item.focus();
          break;
        }
      }
    }
  }, []);

  const { hasFocusLock, setHasFocusLock } = useFocusContext();
  useEffect(() => {
    if (isOpen) {
      setHasFocusLock(true);
      return () => {
        setHasFocusLock(false);
      };
    }
  }, [isOpen, setHasFocusLock]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.addEventListener('click', toggleIsOpen);

    return () => {
      window.removeEventListener('click', toggleIsOpen);
    };
  }, [isOpen]);

  const onClick: MouseEventHandler = useCallback((event) => {
    toggleIsOpen();
    event.stopPropagation();
  }, []);

  return (
    <span css={containerStyles} ref={containerRef}>
      <Button
        role="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={onClick}
        onKeyDown={onKeyDown}
        inert={hasFocusLock ? 'true' : undefined}
        ref={triggerRef}
      >
        <img {...moreIcon} alt="" />
      </Button>
      {isOpen && (
        <Menu ref={menuRef} onKeyDown={onMenuKeyDown}>
          {children}
        </Menu>
      )}
    </span>
  );
};
