export type Item = {
  itemId: string;
};

export type ColumnType = {
  title: string;
  columnId: string;
  items: Item[];
};
export type ColumnMap = { [columnId: string]: ColumnType };

function getItems({ count, startColumnId }: { count: number; startColumnId: string }): Item[] {
  return Array.from(
    { length: count },
    (_, index): Item => ({
      itemId: `${startColumnId}${index}`,
    }),
  );
}

export function getInitialData({ count }: { count: number } = { count: 200 }) {
  const orderedColumnIds: string[] = ['A', 'B', 'C'];
  const columns: ColumnType[] = orderedColumnIds.map((columnId, index) => {
    const column: ColumnType = {
      title: `Column ${columnId}`,
      columnId: columnId,
      items: getItems({
        startColumnId: columnId,
        count: Math.floor(count / orderedColumnIds.length),
      }),
    };
    return column;
  });
  const columnMap = columns.reduce((acc: ColumnMap, column) => {
    acc[column.columnId] = column;
    return acc;
  }, {});

  return { columnMap, orderedColumnIds };
}
