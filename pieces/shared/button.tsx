import { ButtonHTMLAttributes, forwardRef } from 'react';

import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const buttonStyles = css({
  width: 'calc(var(--grid) * 3)',
  height: 'calc(var(--grid) * 3)',
  border: 0,
  borderRadius: 3,
  display: 'flex',
  padding: 0,
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: token('color.background.neutral', '#091e420f'),
  ':hover': {
    background: token('color.background.neutral.hovered', '#091E4224'),
  },
  ':active': {
    background: token('color.background.neutral.pressed', '#091E424F'),
  },
});

const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function Button({ children, ...props }, ref) {
    return (
      <button css={buttonStyles} {...props} ref={ref}>
        {children}
      </button>
    );
  },
);

export default Button;
