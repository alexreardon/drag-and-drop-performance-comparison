import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from './card';

export function SortableCard({ itemId }: { itemId: string }) {
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: itemId,
  });

  const style = {
    opacity: isDragging ? '0' : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      itemId={itemId}
      state="idle"
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={style}
    />
  );
}
