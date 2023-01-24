import React, { ReactElement } from 'react';
declare type ErrorBoundaryProps = {
    children: ReactElement;
    instanceId: symbol;
};
/**
 * Cancels drags when errors occur.
 */
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
    componentDidCatch(err: Error): void;
    render(): JSX.Element;
}
export {};
