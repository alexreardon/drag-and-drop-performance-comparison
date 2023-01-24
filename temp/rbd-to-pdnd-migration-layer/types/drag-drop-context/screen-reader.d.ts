import type { DragStart, DragUpdate, DropResult, ResponderProvided } from 'react-beautiful-dnd';
export declare const defaultMessage: {
    readonly onDragStart: (start: DragStart) => string;
    readonly onDragUpdate: ({ source, destination }: DragUpdate) => string;
    readonly onDragEnd: ({ source, destination, reason }: DropResult) => string;
};
declare type EventName = keyof typeof defaultMessage;
declare type EventData<Event extends EventName> = Parameters<typeof defaultMessage[Event]>[0];
export declare function getDefaultMessage<Event extends EventName>(event: Event, data: EventData<Event>): string;
export declare function getProvided<Event extends EventName>(event: Event, data: EventData<Event>): {
    provided: ResponderProvided;
    getMessage(): string;
};
export { announce } from '@atlaskit/drag-and-drop-live-region';
