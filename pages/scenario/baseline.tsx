import { NextPage } from 'next';

import Board from '../../pieces/scenario/baseline/board';
import About from '../../pieces/shared/about';

const Baseline: NextPage = () => {
  return (
    <>
      <About />
      <Board />
    </>
  );
};

export default Baseline;
