import { ReactNode } from 'react';
declare type DroppableRegistryData = {
    type: string;
    getElement(): HTMLElement | null;
};
export declare function ElementRegistryProvider({ children }: {
    children: ReactNode;
}): JSX.Element;
export declare function useDroppableRegistry({ type, getElement, }: DroppableRegistryData): void;
export {};
