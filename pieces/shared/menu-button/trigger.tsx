import { forwardRef, KeyboardEventHandler, MouseEventHandler } from 'react';

import Button from '../button';
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
