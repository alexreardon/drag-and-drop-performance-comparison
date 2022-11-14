import { monitorForElements } from '@atlaskit/drag-and-drop/adapter/element';
import { CleanupFn } from '@atlaskit/drag-and-drop/types';
import { Data } from '../../data/tasks';
import { reorder } from '../atlaskit-drag-and-drop/reorder';

export function attachReordering({
  getData,
  setData,
}: {
  getData: () => Data;
  setData: (data: Data) => void;
}): CleanupFn {
  return monitorForElements({
    onDrop(args) {
      const updated = reorder({ data: getData(), result: args });
      if (updated) {
        setData(updated);
      }
    },
  });
}
