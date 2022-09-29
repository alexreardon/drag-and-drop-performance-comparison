import {
  KeyboardEventHandler,
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import Button from '../button';
import moreIcon from '../more.svg';

type TriggerProps = {
  isOpen: boolean;
  label: string;
  openMenu: ({ initialFocus }: { initialFocus: 'first' | 'last' }) => void;
  shouldResetFocus: boolean;
};

/**
 * Handles moving focus back to the trigger on menu close.
 */
function useFocusOnClose(
  ref: RefObject<HTMLUnknownElement>,
  {
    isOpen,
    shouldResetFocus,
  }: {
    isOpen: boolean;
    shouldResetFocus: boolean;
  },
) {
  useEffect(() => {
    if (!isOpen && shouldResetFocus) {
      // Running in an 'immediate' timeout so that
      // when the menu has closed because of an enter key press,
      // it won't trigger a click event on the trigger as well.
      setTimeout(() => {
        ref.current?.focus();
      }, 0);
    }
  }, [isOpen, ref, shouldResetFocus]);
}

function Trigger({ isOpen, label, openMenu, shouldResetFocus }: TriggerProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useFocusOnClose(ref, { isOpen, shouldResetFocus });

  const onClick: MouseEventHandler = useCallback(() => {
    openMenu({ initialFocus: 'first' });
  }, [openMenu]);

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
      aria-expanded={isOpen}
      aria-label={label}
      onClick={onClick}
      onKeyDown={onKeyDown}
      ref={ref}
    >
      <img {...moreIcon} alt="" draggable={false} />
    </Button>
  );
}

export default Trigger;
