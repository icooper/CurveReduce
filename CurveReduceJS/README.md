# CurveReduce

This is an implementation of the [Ramer-Douglas-Peucker (RDP) curve simplification algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm) in TypeScript.

## Usage

Install from the NPM package repository using `npm install --save curvereduce`.

```typescript
import { Point, Simplify, SimplifyTo } from 'curvereduce';

const points: Point[] = [
    { x: 1.20401E-09, y: -0.00120428 },
    { x: 0.018, y: 0.241799 },
    { x: 0.1044, y: 1.34392 },
    ...
];

// use an explicit epsilon value
let simplified1 = Simplify(points, 0.1075);

// or specify a number of points you want to end up with
let simplified2 = SimplifyTo(points, 20);
```
## License

This work is licensed under the [MIT License](../LICENSE.md).

## Credits

This RDP algorithm implementation is heavily influenced by [Marius Karthaus's JavaScript implementation](https://karthaus.nl/rdp/).