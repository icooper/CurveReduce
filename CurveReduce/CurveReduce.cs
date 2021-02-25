using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CurveReduce
{
    public static class CurveReduce
    {

        public const int SEARCH_MAX = int.MaxValue;

        static int BinarySearch(Func<int, int> predicate, int min = 1, int max = SEARCH_MAX)
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
            List<Point> list = new List<Point>(points.GetLength(0));
            for (int i = 0; i < points.GetLength(0); i++)
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

        public static IList<Point> SimplifyTo(this IList<Point> points, int pointCount, bool perpendicularDistance = false)
        {
            // determine max epsilon value to try
            double epsilon = points.MaxDistance(perpendicularDistance).Item1;

            // get simplified list
            IList<Point> result = points.Simplify(epsilon * BinarySearch(i =>
            {
                int count = points.Simplify(epsilon / SEARCH_MAX * i, perpendicularDistance).Count();
                return count == pointCount ? 0 : count < pointCount ? -1 : 1;
            }, 1) / SEARCH_MAX, perpendicularDistance);

            // return simplified list
            return result;
        }

        public static IList<Point> Simplify(this IList<Point> points, double epsilon, bool perpendicularDistance = false)
        {
            IList<Point> result;

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
                    resultList.AddRange(new List<Point>(points.Take(distance.Item2)).Simplify(epsilon, perpendicularDistance));
                    resultList.AddRange(new List<Point>(points.Skip(distance.Item2)).Simplify(epsilon, perpendicularDistance).Skip(1));
                    result = resultList;
                }
                else
                {
                    result = new List<Point>(2)
                    {
                        points.First(),
                        points.Last()
                    };
                }
            }

            return result;
        }
    }
}
