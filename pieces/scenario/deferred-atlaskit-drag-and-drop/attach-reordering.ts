import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/adapter/element';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/types';
import { Data } from '../../data/tasks';
import { reorder } from '../atlaskit-drag-and-drop/reorder';

export function attachReordering({
  data,
  setData,
}: {
  data: Data;
  setData: (data: Data) => void;
}): CleanupFn {
  return monitorForElements({
    onDrop(args) {
      const updated = reorder({ data, result: args });
      if (updated) {
        setData(updated);
      }
    },
  });
}
