import { NextPage } from 'next';

import Board from '../../pieces/scenario/deferred-pragmatic-drag-and-drop/board';
import About from '../../pieces/shared/about';

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="@atlaskit/pragmatic-drag-and-drop (deferred)" />
    </>
  );
};

export default Page;
