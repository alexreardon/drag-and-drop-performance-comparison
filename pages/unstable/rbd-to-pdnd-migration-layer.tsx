import { NextPage } from 'next';
import { resetServerContext } from '../../temp/rbd-to-pdnd-migration-layer/esm';

import Board from '../../pieces/scenario/rbd-to-pdnd-migration-layer/board';
import About from '../../pieces/shared/about';

export async function getStaticProps() {
  resetServerContext();
  return {
    props: {},
  };
}

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="rbd-to-pdnd-migration-layer" />
    </>
  );
};

export default Page;
