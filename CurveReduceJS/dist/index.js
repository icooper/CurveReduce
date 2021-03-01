"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimplifyTo = exports.Simplify = exports.BinarySearch = exports.MaxDistance = exports.DefaultDistanceFunc = exports.ShortestDistance = exports.PerpendicularDistance = void 0;
/**
 * Calculates the perpendicular distance between point `p` and the line intersecting points `a` and `b`.
 * @param p point
 * @param a line point
 * @param b line point
 * @returns distance
 */
const PerpendicularDistance = (p, a, b) => {
    let distance;
    // horizontal line
    if (a.x === b.x)
        distance = Math.abs(p.x - a.x);
    // vertical line
    else if (a.y === b.y)
        distance = Math.abs(p.y - a.y);
    // sloped line
    else {
        const slope = (b.y - a.y) / (b.x - a.x);
        const intercept = a.y - (slope * a.x);
        distance = Math.abs(slope * p.x - p.y + intercept) / Math.sqrt(Math.pow(slope, 2) + 1);
    }
    return distance;
};
exports.PerpendicularDistance = PerpendicularDistance;
/**
 * Calculates the shortest distance between point `p` and the line segment between points `a` and `b`.
 * @param p point
 * @param a line point
 * @param b line point
 * @returns distance
 */
const ShortestDistance = (p, a, b) => {
    // function to calculate the square of the distance between two points
    const pointDistSq = (i, j) => Math.pow(i.x - j.x, 2) + Math.pow(i.y - j.y, 2);
    let distance;
    const lineLenSq = pointDistSq(a, b);
    // line is actually just a point
    if (lineLenSq === 0)
        distance = pointDistSq(p, a);
    // line is a line
    else {
        // which endpoint is the point closer to?
        const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / lineLenSq;
        // closer to point A
        if (t < 0)
            distance = pointDistSq(p, a);
        // closer to point B
        else if (t > 1)
            distance = pointDistSq(p, b);
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
};
exports.ShortestDistance = ShortestDistance;
/**
 * The default distance function if none is specified.
 */
exports.DefaultDistanceFunc = exports.ShortestDistance;
/**
 * Finds the data point in the curve that is furthest away from the straight line between the first and last points of the curve.
 * @param points points describing the curve
 * @param distanceFunc function used for determining distance
 * @returns distance and index of furthest point
 */
const MaxDistance = (points, distanceFunc = exports.DefaultDistanceFunc) => {
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
};
exports.MaxDistance = MaxDistance;
/**
 * Generic binary search algorithm, used by `SimplifyTo()`.
 * @param test function used for evaluating the number being tested
 * @param min the low end of the range to test
 * @param max the high end of the range to test
 * @returns the number closest to the target
 */
const BinarySearch = (test, min = 1, max = Number.MAX_SAFE_INTEGER) => {
    // set up our left, right, and middle points
    let l = Math.floor(min), r = Math.floor(max), m = Math.floor(l + (r - l) / 2);
    // as long as we have something to test
    while (r - l >= 1) {
        // check the middle point
        const t = test(m);
        // it's on target, return it
        if (t == 0)
            return m;
        // it's low, use the lower half of our search range
        else if (t < 0)
            r = m - 1;
        // it's high, use the upper half of our search range
        else
            l = m + 1;
        // recalculate the middle point
        m = Math.floor(l + (r - l) / 2);
    }
    // we never found what we were looking for, but the middle point is the
    // closest that we have, so return it
    return m;
};
exports.BinarySearch = BinarySearch;
/**
 * Simplifies a curve with an explicit epsilon value using the Ramer-Douglas-Peucker algorithm.
 * @param points points describing the curve
 * @param epsilon the minimum distance from the curve
 * @param distanceFunc function used for determining distance
 * @returns points making up the simplified curve
 */
const Simplify = (points, epsilon, distanceFunc = exports.DefaultDistanceFunc) => {
    // make sure that our epsilon value is not negative
    if (epsilon < 0) {
        throw new Error('Epsilon must not be negative.');
    }
    var result;
    // make sure we don't do unnecessary work
    if (epsilon === 0 || points.length < 3)
        result = points.slice(0);
    // recursively break down the curve
    else {
        // get the max distance in the curve
        const max = exports.MaxDistance(points, distanceFunc);
        // if the max distance is greater than epsilon
        if (max.distance > epsilon) {
            // break down curve at the max distance point and recursively simplify each side
            result = [
                ...exports.Simplify(points.slice(0, max.index + 1), epsilon, distanceFunc).slice(0, -1),
                ...exports.Simplify(points.slice(max.index), epsilon, distanceFunc)
            ];
        }
        // the max distance is insignificant, so just remove all the points in the middle
        else
            result = [points[0], points[points.length - 1]];
    }
    return result;
};
exports.Simplify = Simplify;
/**
 * Simplifies a curve to approximately the desired number of data points using the Ramer-Douglas-Peucker algorithm.
 * @param points points describing the curve
 * @param pointCount the desired number of points in the simplified curve
 * @param distanceFunc function used for determining distance
 * @returns points making up the simplified curve
 */
const SimplifyTo = (points, pointCount, distanceFunc = exports.DefaultDistanceFunc) => {
    let result;
    // let's not do unnecessary work
    if (pointCount < 3)
        result = [points[0], points[points.length - 1]];
    else if (pointCount >= points.length)
        result = points.slice(0);
    // search for the best epsilon value
    else {
        // a really big number to use as the denominator of our step
        const max = Number.MAX_SAFE_INTEGER;
        // use the max distance of the curve as the numerator
        const step = exports.MaxDistance(points, distanceFunc).distance / max;
        // binary search to find a good epsilon value
        result = exports.Simplify(points, step * exports.BinarySearch(i => {
            // return a comparison between the target number of points and the
            // number of points generated using the specified epsilon value
            return exports.Simplify(points, step * i, distanceFunc).length - pointCount;
        }, 1, max), distanceFunc);
    }
    // this probably has the desired number of points, but it's not guaranteed
    return result;
};
exports.SimplifyTo = SimplifyTo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBZUE7Ozs7OztHQU1HO0FBQ0ksTUFBTSxxQkFBcUIsR0FBaUIsQ0FBQyxDQUFRLEVBQUUsQ0FBUSxFQUFFLENBQVEsRUFBRSxFQUFFO0lBQ2hGLElBQUksUUFBUSxDQUFDO0lBRWIsa0JBQWtCO0lBQ2xCLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhELGdCQUFnQjtTQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXJELGNBQWM7U0FDVDtRQUNELE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDMUY7SUFFRCxPQUFPLFFBQVEsQ0FB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