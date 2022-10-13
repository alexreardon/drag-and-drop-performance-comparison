import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

const containerStyles = css({
  background: token('color.background.sunken'),
  position: 'absolute',
  bottom: 0,
  left: 0,
  padding: 'var(--grid)',
  borderTopRightRadius: 'var(--border-radius)',
});

export default function About() {
  return (
    <div css={containerStyles}>
      <h3>Example</h3>
      <code>NODE_ENV</code>: <code>{process.env.NODE_ENV}</code>
    </div>
  );
}
