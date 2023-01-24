/**
 * Data that is attached to drags. The same data is used for the `draggable()`
 * and `dropTargetForElements()` calls related to a `<Draggable>` instance.
 */
export declare type DraggableData = {
    /**
     * Indicates this data is for a `<Draggable>` instance.
     */
    isDraggable: true;
    /**
     * The `draggableId` of the `<Draggable>` instance.
     */
    draggableId: string;
    /**
     * Lazily returns the `index` of the `<Draggable>` instance.
     *
     * This is a function because the `index` can change during a drag.
     */
    getIndex: () => number;
    /**
     * The `droppableId` of the containing `<Droppable>` instance.
     */
    droppableId: string;
    /**
     * The `type` of the containing `<Droppable>` instance.
     */
    type: string;
    instanceId: Symbol;
};
export declare function isDraggableData(data: Record<string, unknown>): data is DraggableData;
