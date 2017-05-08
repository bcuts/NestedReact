/// <reference types="react" />
import React from './react-mvx';
export interface BackboneViewProps {
    View: any;
    options: object;
    className?: string;
}
export default class BackboneView extends React.Component<BackboneViewProps> {
    shouldComponentUpdate(next: any): boolean;
    view: any;
    hasUnsavedChanges(): any;
    root: any;
    saveRef: (element: any) => void;
    render(): React.DOMElement<{
        ref: (element: any) => void;
        className: string;
    }, any>;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    _mountView(): void;
    _dispose(): void;
}