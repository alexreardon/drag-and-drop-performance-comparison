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
  // isOpen: boolean;
  label: string;
  openMenu: ({ initialFocus }: { initialFocus: 'first' | 'last' }) => void;
  closeMenu: () => void;
  isMenuOpen: boolean;
  // shouldGiveTriggerFocus: boolean;
};

/**
 * Handles moving focus back to the trigger on menu close.
 */
// function useFocusOnClose(
//   ref: RefObject<HTMLButtonElement>,
//   {
//     isOpen,
//     shouldGiveTriggerFocus,
//   }: {
//     isOpen: boolean;
//     shouldGiveTriggerFocus: boolean;
//   },
// ) {
//   useEffect(() => {
//     if (!isOpen && shouldGiveTriggerFocus) {
//       // Running in an 'immediate' timeout so that
//       // when the menu has closed because of an enter key press,
//       // it won't trigger a click event on the trigger as well.
//       setTimeout(() => {
//         ref.current?.focus();
//       }, 0);
//     }
//   }, [isOpen, ref, shouldGiveTriggerFocus]);
// }

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  { label, openMenu, closeMenu, isMenuOpen },
  forwardedRef,
) {
  const ref = useRef<HTMLButtonElement>(null);
  // useFocusOnClose(ref, { isOpen, shouldGiveTriggerFocus });

  const onClick: MouseEventHandler = useCallback(() => {
    if (!isMenuOpen) {
      openMenu({ initialFocus: 'first' });
    } else {
      closeMenu();
    }
  }, [isMenuOpen, openMenu]);

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
