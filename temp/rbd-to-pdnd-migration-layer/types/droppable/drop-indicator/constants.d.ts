export declare const directionMapping: {
    readonly vertical: {
        readonly mainAxis: {
            readonly offset: "offsetTop";
            readonly length: "offsetHeight";
            readonly scrollOffset: "scrollTop";
            readonly forwardEdge: "bottom";
            readonly overflow: "overflowY";
            readonly style: {
                readonly transform: "translateY";
            };
        };
        readonly crossAxis: {
            readonly offset: "offsetLeft";
            readonly length: "offsetWidth";
            readonly style: {
                readonly length: "width";
                readonly offset: "left";
            };
        };
    };
    readonly horizontal: {
        readonly mainAxis: {
            readonly offset: "offsetLeft";
            readonly length: "offsetWidth";
            readonly scrollOffset: "scrollLeft";
            readonly forwardEdge: "right";
            readonly overflow: "overflowX";
            readonly style: {
                readonly transform: "translateX";
            };
        };
        readonly crossAxis: {
            readonly offset: "offsetTop";
            readonly length: "offsetHeight";
            readonly style: {
                readonly length: "height";
                readonly offset: "top";
            };
        };
    };
};
/**
 * The thickness of the drop indicator line, in pixels.
 */
export declare const lineThickness = 2;
/**
 * The distance to pull the line back by, to account for its thickness.
 */
export declare const lineOffset: number;
