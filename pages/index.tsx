import type { GetStaticProps, NextPage } from 'next';
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import githubIcon from '../pieces/shared/github.svg';
import { css, Global } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import Image from 'next/image';

export const getStaticProps: GetStaticProps = async () => {
  const filePaths: string[] = await fs.readdir(path.join(process.cwd(), 'pages', 'scenario'));
  const slugs: string[] = filePaths.map((file) => `/scenario/${file.replace('.tsx', '')}`);
  return {
    props: {
      slugs,
    },
  };
};

const headerStyles = css({
  background: `linear-gradient(43deg, ${token('color.accent.boldGreen')} 0%, ${token(
    'color.accent.boldOrange',
  )} 46%, ${token('color.accent.boldRed')} 100%)`,
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontSize: '3rem',
  textAlign: 'center',
});
const subHeaderStyles = css({
  textTransform: 'uppercase',
  fontSize: '1.2rem',
  fontWeight: 'bold',
});

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'calc(var(--grid) * 2)',
  padding: '0 calc(var(--grid) * 2)',
  maxWidth: '600px',
  alignContent: 'center',
  margin: '0 auto',

  // disabling default css-reset margins
  '> *': {
    margin: '0',
  },
});

const repoLinkStyles = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 'calc(var(--grid) / 2)',
});

const Home: NextPage = ({ slugs }: { slugs?: string[] }) => {
  return (
    <>
      <div css={containerStyles}>
        <h1 css={headerStyles}>
          <span>Drag and drop libraries</span>
          <span css={subHeaderStyles}>performance comparison</span>
        </h1>
        <p>
          <a
            css={repoLinkStyles}
            href="https://github.com/alexreardon/drag-and-drop-performance-comparison"
          >
            <Image {...githubIcon} alt="" draggable={false} />
            Repo
          </a>
        </p>
        <p css={css({ textAlign: 'center' })}>
          This application contains the same board example, powered by different drag and drop
          libraries on different urls. This allows external tools to compare the performance of the
          different libraries
        </p>
        <ul>
          {slugs?.map((slug) => (
            <li key={slug}>
              <Link href={slug}>{slug}</Link>
            </li>
          ))}
        </ul>
        <div>
          Made with <span aria-label="love">❤️</span> by{' '}
          <a href="https://twitter.com/alexandereardon" rel="author">
            @alexandereardon
          </a>{' '}
          and{' '}
          <a href="https://twitter.com/DeclanWarn" rel="author">
            @DeclanWarn
          </a>
        </div>
      </div>
    </>
  );
};

export default Home;
