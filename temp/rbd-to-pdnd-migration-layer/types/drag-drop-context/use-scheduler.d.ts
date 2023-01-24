declare type ScheduledFunction = () => void;
declare type Schedule = (scheduledFunction: ScheduledFunction) => void;
declare type Flush = () => void;
/**
 * Used to schedule callbacks inside of a `setTimeout(fn, 0)`.
 */
export declare function useScheduler(): {
    /**
     * Queues the provided function to be called asynchronously.
     */
    schedule: Schedule;
    /**
     * Calls the queue of functions synchronously, and cancels the pending timeouts.
     */
    flush: Flush;
};
export {};
