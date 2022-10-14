import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';
import Link from 'next/link';

const containerStyles = css({
  // background: token('color.background.accent.purple'),
  border: `2px solid ${token('color.background.accent.purple.bold')}`,
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

  // ✨ Adapted from: https://twitter.com/pokecoder/status/1579237106169544704
  background: `conic-gradient(
    from 90deg at 80% 50%,
    ${token('color.background.accent.orange')} 12%,
    ${token('color.background.accent.magenta')} 12%, ${token(
    'color.background.accent.magenta',
  )} 33%,
    ${token('color.background.accent.blue')} 33%, ${token('color.background.accent.blue')} 55%,
    ${token('color.background.accent.green')} 55%, ${token('color.background.accent.green')} 70%,
    ${token('color.background.accent.purple')} 70%, ${token('color.background.accent.purple')} 87%,
    ${token('color.background.accent.orange')} 85%)`,
});

export default function About({ title }: { title: string }) {
  return (
    <div css={containerStyles}>
      <h4>Scenario: {title}</h4>
      <Link href="/">
        <a>← Go Home</a>
      </Link>
      <div>
        <code>NODE_ENV</code>: <code>{process.env.NODE_ENV}</code>
      </div>
    </div>
  );
}
