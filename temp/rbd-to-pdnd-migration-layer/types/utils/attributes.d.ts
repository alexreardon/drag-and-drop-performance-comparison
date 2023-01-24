export declare const attributes: {
    readonly draggable: {
        readonly contextId: "data-rbd-draggable-context-id";
        readonly id: "data-rbd-draggable-id";
    };
    readonly dragHandle: {
        readonly contextId: "data-rbd-drag-handle-context-id";
        readonly draggableId: "data-rbd-drag-handle-draggable-id";
    };
    readonly droppable: {
        readonly contextId: "data-rbd-droppable-context-id";
        readonly id: "data-rbd-droppable-id";
    };
    readonly placeholder: {
        readonly contextId: "data-rbd-placeholder-context-id";
    };
};
/**
 * These attributes are not set by `react-beautiful-dnd`,
 * but they expose useful information for the migration layer.
 */
export declare const customAttributes: {
    readonly draggable: {
        readonly droppableId: "data-rbd-draggable-droppable-id";
        readonly index: "data-rbd-draggable-index";
    };
    readonly dropIndicator: "data-rbd-drop-indicator";
    readonly droppable: {
        readonly direction: "data-rbd-droppable-direction";
        readonly type: "data-rbd-droppable-type";
    };
};
declare type LeafOf<Object extends Record<string, any>, Value = Object[keyof Object]> = Value extends Record<string, any> ? LeafOf<Value> : Value;
declare type Attribute = LeafOf<typeof attributes> | LeafOf<typeof customAttributes>;
export declare function getAttribute(element: HTMLElement, attribute: Attribute): string;
declare type CleanUpFn = () => void;
export declare function setAttributes(element: HTMLElement, attributes: Partial<Record<Attribute, string>>): CleanUpFn;
export {};
