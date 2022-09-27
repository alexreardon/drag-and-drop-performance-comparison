import { forwardRef, KeyboardEventHandler, MouseEventHandler, useEffect } from 'react';

import Button from '../button';
import { useFocusContext } from '../focus-context';
import moreIcon from '../more.svg';

type TriggerProps = {
  isOpen: boolean;
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onKeyDown: KeyboardEventHandler<HTMLButtonElement>;
};

const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function Trigger(
  { isOpen, label, onClick, onKeyDown },
  ref,
) {
  const { hasFocusLock, setHasFocusLock } = useFocusContext();

  useEffect(() => {
    if (isOpen) {
      setHasFocusLock(true);
      return () => {
        setHasFocusLock(false);
      };
    }
  }, [isOpen, setHasFocusLock]);

  return (
    <Button
      role="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-label={label}
      onClick={onClick}
      onKeyDown={onKeyDown}
      inert={hasFocusLock ? 'true' : undefined}
      ref={ref}
    >
      <img {...moreIcon} alt="" />
    </Button>
  );
});

export default Trigger;
