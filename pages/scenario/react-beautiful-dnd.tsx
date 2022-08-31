import { NextPage } from 'next';
import { resetServerContext } from 'react-beautiful-dnd';

import Board from '../../pieces/scenario/react-beautiful-dnd/board';

export async function getStaticProps() {
  resetServerContext();
  return {
    props: {}, // will be passed to the page component as props
  };
}

const Page: NextPage = () => {
  return <Board />;
};

export default Page;
