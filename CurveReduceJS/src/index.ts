/**
 * Type for (x, y) coordinate pair.
 */
export type Point = { x: number, y: number };

/**
 * Method signature for distance calculation.
 */
export type DistanceFunc = (p: Point, a: Point, b: Point) => number;

/**
 * Distance and index as returned by `MaxDistance()`.
 */
type DistanceIndex = { distance: number, index: number };

/**
 * Calculates the perpendicular distance between point `p` and the line intersecting points `a` and `b`.
 * @param p point
 * @param a line point
 * @param b line point
 * @returns distance
 */
export const PerpendicularDistance: DistanceFunc = (p: Point, a: Point, b: Point) => {
    let distance;

    // horizontal line
    if (a.x === b.x) distance = Math.abs(p.x - a.x);

    // vertical line
    else if (a.y === b.y) distance = Math.abs(p.y - a.y);

    // sloped line
    else {
        const slope = (b.y - a.y) / (b.x - a.x);
        const intercept = a.y - (slope * a.x);
        distance = Math.abs(slope * p.x - p.y + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
    }

    return distance;
}

/**
 * Calculates the shortest distance between point `p` and the line segment between points `a` and `b`.
 * @param p point
 * @param a line point
 * @param b line point
 * @returns distance
 */
export const ShortestDistance: DistanceFunc = (p: Point, a: Point, b: Point) => {

    // function to calculate the square of the distance between two points
    const pointDistSq = (i: Point, j: Point) => Math.pow(i.x - j.x, 2) + Math.pow(i.y - j.y, 2);

    let distance;
    const lineLenSq = pointDistSq(a, b);

    // line is actually just a point
    if (lineLenSq === 0) distance = pointDistSq(p, a);

    // line is a line
    else {

        // which endpoint is the point closer to?
        const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / lineLenSq;

        // closer to point A
        if (t < 0) distance = pointDistSq(p, a);
        
        // closer to point B
        else if (t > 1) distance = pointDistSq(p, b);

        // somewhere in the middle
        else {
            distance = pointDistSq(p, {
                x: a.x + t * (b.x - a.x),
                y: a.y + t * (b.y - a.y)
            });
        }
    }

    // make sure we return the square root of the distance
    return Math.sqrt(distance);
}

/**
 * The default distance function if none is specified.
 */
export let DefaultDistanceFunc = ShortestDistance;

/**
 * Finds the data point in the curve that is furthest away from the straight line between the first and last points of the curve.
 * @param points points describing the curve
 * @param distanceFunc function used for determining distance
 * @returns distance and index of furthest point
 */
export const MaxDistance = (points: Point[], distanceFunc: DistanceFunc = DefaultDistanceFunc): DistanceIndex => {
    
    // save the first and last points
    const first = points[0];
    const last = points[points.length - 1];

    // distance and index of furthest point
    let index = -1;
    let distance = 0;

    // loop through the points between the first and the last
    for (let i = 1; i < points.length - 1; i++) {

        // get the distance using the provided distance function
        let d = distanceFunc(points[i], first, last);

        // save the distance and index if this is the longest so far
        if (d > distance) {
            distance = d;
            index = i;
        }
    }

    return { distance, index };
}

/**
 * Generic binary search algorithm, used by `SimplifyTo()`.
 * @param test function used for evaluating the number being tested
 * @param min the low end of the range to test
 * @param max the high end of the range to test
 * @returns the number closest to the target
 */
export const BinarySearch = (test: (a: number) => number, min: number = 1, max: number = Number.MAX_SAFE_INTEGER): number => {

    // set up our left, right, and middle points
    let l = Math.floor(min), r = Math.floor(max), m = Math.floor(l + (r - l) / 2)

    // as long as we have something to test
    while (r - l >= 1) {

        // check the middle point
        const t = test(m);

        // it's on target, return it
        if (t == 0) return m;

        // it's low, use the lower half of our search range
        else if (t < 0) r = m - 1;

        // it's high, use the upper half of our search range
        else l = m + 1;
        
        // recalculate the middle point
        m = Math.floor(l + (r - l) / 2);
    }

    // we never found what we were looking for, but the middle point is the
    // closest that we have, so return it
    return m;
};

/**
 * Simplifies a curve with an explicit epsilon value using the Ramer-Douglas-Peucker algorithm.
 * @param points points describing the curve
 * @param epsilon the minimum distance from the curve
 * @param distanceFunc function used for determining distance
 * @returns points making up the simplified curve
 */
export const Simplify = (points: Point[], epsilon: number, distanceFunc: DistanceFunc = DefaultDistanceFunc): Point[] => {

    // make sure that our epsilon value is not negative
    if (epsilon < 0) {
        throw new Error('Epsilon must not be negative.');
    }

    var result: Point[];

    // make sure we don't do unnecessary work
    if (epsilon === 0 || points.length < 3) result = points.slice(0);

    // recursively break down the curve
    else {
        
        // get the max distance in the curve
        const max = MaxDistance(points, distanceFunc);

        // if the max distance is greater than epsilon
        if (max.distance > epsilon) {

            // break down curve at the max distance point and recursively simplify each side
            result = [
                ...Simplify(points.slice(0, max.index + 1), epsilon, distanceFunc).slice(0, -1),
                ...Simplify(points.slice(max.index), epsilon, distanceFunc)
            ];
        }
        
        // the max distance is insignificant, so just remove all the points in the middle
        else result = [ points[0], points[points.length - 1] ];
    }

    return result;
}

/**
 * Simplifies a curve to approximately the desired number of data points using the Ramer-Douglas-Peucker algorithm.
 * @param points points describing the curve
 * @param pointCount the desired number of points in the simplified curve
 * @param distanceFunc function used for determining distance
 * @returns points making up the simplified curve
 */
export const SimplifyTo = (points: Point[], pointCount: number, distanceFunc: DistanceFunc = DefaultDistanceFunc): Point[] => {

    let result: Point[];

    // let's not do unnecessary work
    if (pointCount < 3) result = [ points[0], points[points.length - 1] ];
    else if (pointCount >= points.length) result = points.slice(0);

    // search for the best epsilon value
    else {

        // a really big number to use as the denominator of our step
        const max = Number.MAX_SAFE_INTEGER;

        // use the max distance of the curve as the numerator
        const step = MaxDistance(points, distanceFunc).distance / max;

        // binary search to find a good epsilon value
        result = Simplify(points, step * BinarySearch(i => {

            // return a comparison between the target number of points and the
            // number of points generated using the specified epsilon value
            return Simplify(points, step * i, distanceFunc).length - pointCount;
        }, 1, max), distanceFunc);
    }

    // this probably has the desired number of points, but it's not guaranteed
    return result;
}
