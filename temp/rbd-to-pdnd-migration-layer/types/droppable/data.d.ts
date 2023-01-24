export declare type DroppableData = {
    droppableId: string;
    instanceId: symbol;
    isDroppable: true;
    /**
     * Lazily returns whether the droppable is disabled.
     */
    getIsDropDisabled(): boolean;
};
export declare function isDroppableData(data: Record<string, unknown>): data is DroppableData;
