import { NextPage } from 'next';

import Board from '../../pieces/scenario/dnd-kit/board';
import About from '../../pieces/shared/about';

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="dnd-kit" />
    </>
  );
};

export default Page;
