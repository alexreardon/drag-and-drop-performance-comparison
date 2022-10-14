import { NextPage } from 'next';

import Board from '../../pieces/scenario/baseline/board';
import About from '../../pieces/shared/about';

const Baseline: NextPage = () => {
  return (
    <>
      <Board />
      <About title="Baseline" />
    </>
  );
};

export default Baseline;
