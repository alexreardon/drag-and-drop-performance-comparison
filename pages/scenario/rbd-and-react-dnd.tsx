import { NextPage } from 'next';

import Board from '../../pieces/scenario/rbd-and-react-dnd/board';
import About from '../../pieces/shared/about';

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="rbd and react-dnd" />
    </>
  );
};

export default Page;
