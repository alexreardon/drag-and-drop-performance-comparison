import type { GetStaticProps, NextPage } from 'next';
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';

export const getStaticProps: GetStaticProps = async () => {
  const filePaths: string[] = await fs.readdir(path.join(process.cwd(), 'pages', 'scenario'));
  const slugs: string[] = filePaths.map((file) => `/scenario/${file.replace('.tsx', '')}`);
  return {
    props: {
      slugs,
    },
  };
};

const Home: NextPage = ({ slugs }: { slugs?: string[] }) => {
  return (
    <>
      <h1>ReactJS Drag & Drop Libraries' Performance Comparison</h1>
      <p>repo:
        <a href="https://github.com/alexreardon/drag-and-drop-performance-comparison">github.com/alexreardon/drag-and-drop-performance-comparison</a>
      </p>
      <h2>Available scenarios:</h2>
      <ul>
        {slugs?.map((slug) => (
          <li key={slug}>
            <Link href={slug}>{slug}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
