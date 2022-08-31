import React, { useEffect, useRef, useState } from 'react';
import styles from '../../../styles/board.module.css';

import { ColumnMap, ColumnType, getInitialData, Item } from '../../data/tasks';
// import Board from './pieces/board';
// import { Column } from './pieces/column';

export default function Board() {
  const [data, setData] = useState<{
    columnMap: ColumnMap;
    orderedColumnIds: string[];
  }>(() => getInitialData());
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div className={styles.container}>
      {data.orderedColumnIds.map((columnId) => {
        return <Column column={data.columnMap[columnId]} key={columnId} />;
      })}
    </div>
  );

  // return (
  //   <Board ref={ref}>
  //     {data.orderedColumnIds.map((columnId) => {
  //       return <Column column={data.columnMap[columnId]} key={columnId} />;
  //     })}
  //   </Board>
  // );
}
