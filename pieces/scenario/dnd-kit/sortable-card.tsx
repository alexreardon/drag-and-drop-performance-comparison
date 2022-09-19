import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import { Card } from './card';

export const SortableCard = memo(function SortableCard({ itemId }: { itemId: string }) {
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
});
