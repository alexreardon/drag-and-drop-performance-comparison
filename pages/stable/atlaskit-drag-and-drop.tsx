import { NextPage } from 'next';

import Board from '../../pieces/scenario/atlaskit-drag-and-drop/board';
import About from '../../pieces/shared/about';

const Page: NextPage = () => {
  return (
    <>
      <Board />
      <About title="@atlaskit/drag-and-drop" />
    </>
  );
};

export default Page;
