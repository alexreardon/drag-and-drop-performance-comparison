import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import { css } from '@emotion/react';

import Trigger from './trigger';
import Menu, { MenuHandle } from './menu';

const containerStyles = css({
  display: 'flex',
  position: 'relative',
});

/**
 * When pressing a letter (A-Z or a-z) then:
 *
 * - Moves focus to the next menu item with a label that starts with the typed character if such an menu item exists.
 * - Otherwise, focus does not move.
 */
const focusNextMatch = (container: HTMLElement, key: string) => {
  if (!/[a-z]/i.test(key)) {
    return;
  }

  const letter = key.toLowerCase();

  /**
   * The menu items in the menu.
   */
  const items = Array.from(container.querySelectorAll('li'));

  /**
   * The index of the currently focused menu item.
   */
  const activeIndex = items.indexOf(document.activeElement as HTMLLIElement);

  /**
   * The next menu item that matches the typed character.
   */
  let match: HTMLElement | undefined;

  // Initially search only the items after the currently selected one.
  match = items
    .slice(activeIndex + 1)
    .find((item) => item.textContent?.toLowerCase().startsWith(letter));

  // If there was no match found, wrap-around and search from the beginning.
  if (match === undefined) {
    match = items.find((item) => item.textContent?.toLowerCase().startsWith(letter));
  }

  // Focus the match if one was found.
  if (match !== undefined) {
    match.focus();
  }
};

export const MenuButton = ({ label, children }: { label: string; children: ReactNode }) => {
  const [isOpen, toggleIsOpen] = useReducer((isOpen) => !isOpen, false);

  const [initialFocus, setInitialFocus] = useState<'first' | 'last'>('first');

  const menuRef = useRef<MenuHandle>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  /**
   * Handles moving focus back to the trigger on menu close.
   *
   * Not all closures should move focus back,
   * so this ref allows for choosing when it happens.
   */
  const shouldResetFocusRef = useRef(false);
  useEffect(() => {
    if (!isOpen && shouldResetFocusRef.current) {
      shouldResetFocusRef.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const closeMenu = useCallback(({ shouldResetFocus }: { shouldResetFocus: boolean }) => {
    shouldResetFocusRef.current = shouldResetFocus;
    toggleIsOpen();
  }, []);

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback((event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        toggleIsOpen();
        setInitialFocus('first');
        break;

      case 'ArrowUp':
        event.preventDefault();
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

  const onMenuKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (containerRef.current === null) {
        return;
      }

      switch (event.key) {
        case 'Escape':
          closeMenu({ shouldResetFocus: true });
          return;

        case 'ArrowDown':
          menuRef.current?.focusNext();
          event.preventDefault();
          return;

        case 'ArrowUp':
          menuRef.current?.focusPrev();
          event.preventDefault();
          break;

        case 'Home':
          menuRef.current?.focusFirst();
          break;

        case 'End':
          menuRef.current?.focusLast();
          break;
      }

      focusNextMatch(containerRef.current, event.key);
    },
    [closeMenu],
  );

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
      <Trigger
        ref={triggerRef}
        isOpen={isOpen}
        label={label}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
      {isOpen && (
        <Menu ref={menuRef} onKeyDown={onMenuKeyDown} onClose={closeMenu}>
          {children}
        </Menu>
      )}
    </span>
  );
};

export default MenuButton;
