import { NextPage } from 'next';

import Board from '../../pieces/scenario/pragmatic-drag-and-drop/board';
import About from '../../pieces/shared/about';

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="Pragmatic drag and drop" />
    </>
  );
};

export default Page;
