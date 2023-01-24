/**
 * This type is not exported by `@atlaskit/drag-and-drop`
 */
export declare type DragSource = {
    element: HTMLElement;
    dragHandle: Element | null;
    data: Record<string, unknown>;
};
export declare type Action<Name extends string, Payload = undefined> = Payload extends undefined ? {
    type: Name;
} : {
    type: Name;
    payload: Payload;
};
