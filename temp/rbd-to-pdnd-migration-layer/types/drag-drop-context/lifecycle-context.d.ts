import { ReactNode } from 'react';
import type { DraggableId, DraggableLocation, DragStart, DragUpdate } from 'react-beautiful-dnd';
import type { DragLocationHistory } from '@atlaskit/drag-and-drop/types';
declare type DispatchData = {
    onPendingDragStart: {
        start: DragStart;
        location: DragLocationHistory | null;
    };
    onPendingDragUpdate: {
        update: DragUpdate;
        targetLocation: DraggableLocation | null;
    };
    onBeforeDragEnd: {
        draggableId: DraggableId;
    };
};
declare type LifecycleResponders = {
    [Key in keyof DispatchData]: (args: DispatchData[Key]) => void;
};
declare type LifecycleEvent = keyof LifecycleResponders;
declare type Registry = {
    [Key in keyof LifecycleResponders]: LifecycleResponders[Key][];
};
export declare const emptyRegistry: Registry;
declare type CleanupFn = () => void;
declare type AddResponder = <Event extends LifecycleEvent>(event: Event, responder: LifecycleResponders[Event]) => CleanupFn;
declare type Dispatch = <Event extends LifecycleEvent>(event: Event, data: DispatchData[Event]) => void;
declare type Lifecycle = {
    addResponder: AddResponder;
    dispatch: Dispatch;
};
export declare function useLifecycle(): Lifecycle;
declare type MonitorForLifecycle = (args: Partial<LifecycleResponders>) => CleanupFn;
export declare function LifecycleContextProvider({ children, lifecycle, }: {
    children: ReactNode;
    lifecycle: Lifecycle;
}): JSX.Element;
export declare function useMonitorForLifecycle(): MonitorForLifecycle;
export {};
