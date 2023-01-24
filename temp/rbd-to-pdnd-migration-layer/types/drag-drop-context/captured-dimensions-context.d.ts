import { ReactNode } from 'react';
import type { DragState } from './types';
export declare type CapturedDimensions = {
    rect: DOMRect;
    margin: string;
};
export declare function useCapturedDimensions(): CapturedDimensions | null;
export declare function CapturedDimensionsProvider({ children, getDragState, }: {
    children: ReactNode;
    getDragState: () => DragState;
}): JSX.Element;
