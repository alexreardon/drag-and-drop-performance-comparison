import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import Link from 'next/link';

const containerStyles = css({
  // background: token('color.background.accent.purple'),
  border: `2px solid ${token('color.background.accent.purple.bolder')}`,
  borderBottom: 'none',
  borderLeft: 'none',
  position: 'fixed',
  bottom: 0,
  left: 0,
  padding: 'calc(var(--grid) * 2)',
  borderTopRightRadius: 'calc(var(--grid) / 2)',

  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--grid)',

  background: token('color.background.accent.purple.subtlest'),
});

export default function About({ title }: { title: string }) {
  return (
    <div css={containerStyles}>
      <h4>Scenario: {title}</h4>
      <Link href="/">← Go Home</Link>
      <div>
        <code>NODE_ENV</code>: <code>{process.env.NODE_ENV}</code>
      </div>
    </div>
  );
}
