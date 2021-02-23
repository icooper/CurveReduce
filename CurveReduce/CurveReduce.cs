using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CurveReduce
{
    public static class CurveReduce
    {

        public const int SEARCH_MAX = int.MaxValue;

        private static int BinarySearch(Func<int, int> predicate, int min = 1, int max = SEARCH_MAX)
        {
            int l = min, r = max;
            int m = l + (r - l) / 2;
            while (l <= r)
            {
                int p = predicate(m);
                if (p == 0 || r - l < 1) return m;

                if (p < 0) r = m - 1;
                else l = m + 1;
                m = l + (r - l) / 2;
            }
            return m;
        }

        public static List<Point> CreatePointList(double[,] points)
        {
            List<Point> list = new List<Point>(points.Length);
            for (int i = 0; i < points.Length / 2; i++)
            {
                list.Add(new Point(points[i, 0], points[i, 1]));
            }
            return list;
        }

        static Tuple<double, int> MaxDistance(this IEnumerable<Point> points, bool perpendicularDistance = false)
        {
            Point first = points.First();
            Point last = points.Last();

            int index = -1;
            double distance = 0;
            Point[] pointsArray = points.ToArray();
            for (int i = 1; i < pointsArray.Length - 1; i++)
            {
                double currentDistance = perpendicularDistance
                    ? pointsArray[i].DistanceP(first, last)
                    : pointsArray[i].Distance(first, last);

                if (currentDistance > distance)
                {
                    distance = currentDistance;
                    index = i;
                }
            }

            return new Tuple<double, int>(distance, index);
        }

        public static IEnumerable<Point> SimplifyTo(this IEnumerable<Point> points, int pointCount, bool perpendicularDistance = false)
        {
            // determine max epsilon value to try
            double epsilon = points.MaxDistance(perpendicularDistance).Item1;

            // return simplified list
            return points.Simplify(epsilon * BinarySearch(i =>
            {
                int count = points.Simplify(epsilon / SEARCH_MAX * i, perpendicularDistance).Count();
                return count == pointCount ? 0 : count < pointCount ? -1 : 1;
            }, 1) / SEARCH_MAX, perpendicularDistance);

        }

        public static IEnumerable<Point> Simplify(this IEnumerable<Point> points, double epsilon, bool perpendicularDistance = false)
        {
            IEnumerable<Point> result;

            if (points.Count() < 3)
            {
                result = points;
            }
            else
            {
                Tuple<double, int> distance = points.MaxDistance(perpendicularDistance);

                if (distance.Item1 > epsilon)
                {
                    List<Point> resultList = new List<Point>();
                    resultList.AddRange(points.Take(distance.Item2).Simplify(epsilon, perpendicularDistance));
                    resultList.AddRange(points.Skip(distance.Item2).Simplify(epsilon, perpendicularDistance).Skip(1));
                    result = resultList;
                }
                else
                {
                    List<Point> resultList = new List<Point>(2);
                    resultList.Add(points.First());
                    resultList.Add(points.Last());
                    result = resultList;
                }
            }

            return result;
        }
    }
}
