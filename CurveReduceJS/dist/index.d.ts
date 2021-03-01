/**
 * Type for (x, y) coordinate pair.
 */
export declare type Point = {
    x: number;
    y: number;
};
/**
 * Method signature for distance calculation.
 */
export declare type DistanceFunc = (p: Point, a: Point, b: Point) => number;
/**
 * Distance and index as returned by `MaxDistance()`.
 */
declare type DistanceIndex = {
    distance: number;
    index: number;
};
/**
 * Calculates the perpendicular distance between point `p` and the line intersecting points `a` and `b`.
 * @param p point
 * @param a line point
 * @param b line point
 * @returns distance
 */
export declare const PerpendicularDistance: DistanceFunc;
/**
 * Calculates the shortest distance between point `p` and the line segment between points `a` and `b`.
 * @param p point
 * @param a line point
 * @param b line point
 * @returns distance
 */
export declare const ShortestDistance: DistanceFunc;
/**
 * The default distance function if none is specified.
 */
export declare let DefaultDistanceFunc: DistanceFunc;
/**
 * Finds the data point in the curve that is furthest away from the straight line between the first and last points of the curve.
 * @param points points describing the curve
 * @param distanceFunc function used for determining distance
 * @returns distance and index of furthest point
 */
export declare const MaxDistance: (points: Point[], distanceFunc?: DistanceFunc) => DistanceIndex;
/**
 * Generic binary search algorithm, used by `SimplifyTo()`.
 * @param test function used for evaluating the number being tested
 * @param min the low end of the range to test
 * @param max the high end of the range to test
 * @returns the number closest to the target
 */
export declare const BinarySearch: (test: (a: number) => number, min?: number, max?: number) => number;
/**
 * Simplifies a curve with an explicit epsilon value using the Ramer-Douglas-Peucker algorithm.
 * @param points points describing the curve
 * @param epsilon the minimum distance from the curve
 * @param distanceFunc function used for determining distance
 * @returns points making up the simplified curve
 */
export declare const Simplify: (points: Point[], epsilon: number, distanceFunc?: DistanceFunc) => Point[];
/**
 * Simplifies a curve to approximately the desired number of data points using the Ramer-Douglas-Peucker algorithm.
 * @param points points describing the curve
 * @param pointCount the desired number of points in the simplified curve
 * @param distanceFunc function used for determining distance
 * @returns points making up the simplified curve
 */
export declare const SimplifyTo: (points: Point[], pointCount: number, distanceFunc?: DistanceFunc) => Point[];
export {};
