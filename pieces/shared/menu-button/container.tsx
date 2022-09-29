import {
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import { css } from '@emotion/react';
import { bind } from 'bind-event-listener';

import Trigger from './trigger';
import Menu from './menu';
import { focusFirstItem, focusLastItem, focusNextItem, focusPrevItem } from './focus';

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

  const initialFocusRef = useRef<'first' | 'last'>('first');

  const menuRef = useRef<HTMLUListElement>(null);

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
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      toggleIsOpen();
      initialFocusRef.current = 'first';
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      toggleIsOpen();
      initialFocusRef.current = 'last';
    }
  }, []);

  useEffect(() => {
    if (isOpen === false) {
      initialFocusRef.current = 'first';
      return;
    }

    if (initialFocusRef.current === 'first') {
      focusFirstItem(menuRef.current);
    }

    if (initialFocusRef.current === 'last') {
      focusLastItem(menuRef.current);
    }
  }, [isOpen]);

  const containerRef = useRef<HTMLSpanElement>(null);

  const onMenuKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (containerRef.current === null) {
        return;
      }

      if (event.key === 'Escape') {
        closeMenu({ shouldResetFocus: true });
      }

      if (event.key === 'ArrowDown') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusNextItem(menuRef.current);
      }

      if (event.key === 'ArrowUp') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        focusPrevItem(menuRef.current);
      }

      if (event.key === 'Home') {
        focusFirstItem(menuRef.current);
      }

      if (event.key === 'End') {
        focusLastItem(menuRef.current);
      }

      if (!/[a-z]/i.test(event.key)) {
        focusNextMatch(containerRef.current, event.key);
      }
    },
    [closeMenu],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    return bind(window, {
      type: 'click',
      listener: toggleIsOpen,
    });
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
