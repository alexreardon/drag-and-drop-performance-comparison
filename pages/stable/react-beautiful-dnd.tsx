import { NextPage } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';

import Board from '../../pieces/scenario/react-beautiful-dnd/board';
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
      <About title="react-beautiful-dnd" />
    </>
  );
};

export default Page;
