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
      <h1>Available scenarios:</h1>
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
