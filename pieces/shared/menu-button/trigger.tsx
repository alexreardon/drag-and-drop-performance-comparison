import {
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import mergeRefs from '../merge-refs';

import Button from '../button';
import moreIcon from '../more.svg';

type TriggerProps = {
  label: string;
  openMenu: ({ initialFocus }: { initialFocus: 'first' | 'last' }) => void;
  closeMenu: () => void;
  isMenuOpen: boolean;
};

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  { label, openMenu, closeMenu, isMenuOpen },
  forwardedRef,
) {
  const ref = useRef<HTMLButtonElement>(null);

  const onClick: MouseEventHandler = useCallback(() => {
    if (!isMenuOpen) {
      openMenu({ initialFocus: 'first' });
    } else {
      closeMenu();
    }
  }, [isMenuOpen, openMenu, closeMenu]);

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      // Pressing the down arrow opens the menu with the first item selected.
      if (event.key === 'ArrowDown') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        openMenu({ initialFocus: 'first' });
      }

      // Pressing the up arrow opens the menu with the first item selected.
      if (event.key === 'ArrowUp') {
        // Prevent default so nothing scrolls
        event.preventDefault();
        openMenu({ initialFocus: 'last' });
      }
    },
    [openMenu],
  );

  return (
    <Button
      role="button"
      aria-haspopup="menu"
      aria-expanded={isMenuOpen}
      aria-label={label}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={mergeRefs([ref, forwardedRef])}
    >
      <img {...moreIcon} alt="" draggable={false} />
    </Button>
  );
});

export default Trigger;
