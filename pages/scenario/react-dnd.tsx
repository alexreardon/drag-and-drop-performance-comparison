import { NextPage } from 'next';

import Board from '../../pieces/scenario/react-dnd/board';
import About from '../../pieces/shared/about';

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="react-dnd" />
    </>
  );
};

export default Page;
