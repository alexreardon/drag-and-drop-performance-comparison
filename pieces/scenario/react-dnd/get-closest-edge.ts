import { MutableRefObject } from 'react';

export type Edge = 'top' | 'right' | 'bottom' | 'left';

type Position = { x: number; y: number };

const getDistanceToEdge: {
  [TKey in Edge]: (rect: DOMRect, client: Position) => number;
} = {
  top: (rect, client) => Math.abs(client.y - rect.top),
  right: (rect, client) => Math.abs(rect.right - client.x),
  bottom: (rect, client) => Math.abs(rect.bottom - client.y),
  left: (rect, client) => Math.abs(client.x - rect.left),
};

export function getClosestEdge({
  ref,
  allowedEdges,
  client,
}: {
  ref: MutableRefObject<HTMLElement | null>;
  allowedEdges: Edge[];
  client: Position | null;
}): Edge | null {
  const element = ref.current;
  if (element == null || client == null) {
    return null;
  }

  const rect: DOMRect = element.getBoundingClientRect();
  const entries = allowedEdges.map((edge) => {
    return {
      edge,
      value: getDistanceToEdge[edge](rect, client),
    };
  });

  // edge can be `null` when `allowedEdges` is []
  const closestEdge: Edge | null = entries.sort((a, b) => a.value - b.value)[0]?.edge ?? null;

  return closestEdge;
}
