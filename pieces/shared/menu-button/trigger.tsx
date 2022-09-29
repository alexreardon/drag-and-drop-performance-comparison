import { forwardRef, KeyboardEventHandler, MouseEventHandler, useCallback } from 'react';

import Button from '../button';
import moreIcon from '../more.svg';

type TriggerProps = {
  isOpen: boolean;
  label: string;
  openMenu: ({ initialFocus }: { initialFocus: 'first' | 'last' }) => void;
};

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  { isOpen, label, openMenu },
  ref,
) {
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
});

export default Trigger;
