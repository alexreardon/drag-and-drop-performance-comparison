import {
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

const useInitialRender = () => {
  const isInitialRenderRef = useRef(true);
  useEffect(() => {
    isInitialRenderRef.current = false;
  }, []);
  return { isInitialRender: isInitialRenderRef.current };
};

export const MenuButton = ({ label, children }: { label: string; children: ReactNode }) => {
  const [isOpen, toggleIsOpen] = useReducer((isOpen) => !isOpen, false);

  const [initialFocus, setInitialFocus] = useState<'first' | 'last'>('first');

  const menuRef = useRef<MenuHandle>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);

  const { isInitialRender } = useInitialRender();
  useEffect(() => {
    if (!isInitialRender && !isOpen) {
      window.setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  }, [isInitialRender, isOpen]);

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

    if (containerRef.current && /[a-z]/i.test(event.key)) {
      const letter = event.key.toLowerCase();

      const items = Array.from(containerRef.current.querySelectorAll('li'));

      const activeIndex = items.indexOf(document.activeElement as HTMLLIElement);

      let match = items
        .slice(activeIndex + 1)
        .find((item) => item.textContent?.toLowerCase().startsWith(letter));

      if (match === undefined) {
        match = items.find((item) => item.textContent?.toLowerCase().startsWith(letter));
      }

      if (match !== undefined) {
        match.focus();
      }
    }
  }, []);

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

  const onClose = useCallback(() => {
    toggleIsOpen();
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
        <Menu ref={menuRef} onKeyDown={onMenuKeyDown} onClose={onClose}>
          {children}
        </Menu>
      )}
    </span>
  );
};

export default MenuButton;
