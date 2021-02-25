using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CurveReduce
{

    public class Point
    {
        public double X { get; private set; }
        public double Y { get; private set; }

        public Point(double x, double y)
        {
            X = x;
            Y = y;
        }

        public Point(double[] xy)
        {
            if (xy.Length == 2)
            {
                X = xy[0];
                Y = xy[1];
            }
            else
            {
                throw new ArgumentException("Expected 2-element float array.", "xy");
            }
        }

        public string Join(string separator)
        {
            return $"{X}{separator}{Y}";
        }

        public override string ToString()
        {
            return $"Point({X}, {Y})";
        }

        public double[] ToArray() {
            return new double[] { X, Y };
        }

        public double Distance(Point point) => Math.Sqrt(DistanceSq(point));
        protected double DistanceSq(Point point) => Math.Pow(X - point.X, 2) + Math.Pow(Y - point.Y, 2);

        public double Distance(Point a, Point b) => Distance(new Line(a, b));
        public double Distance(Line line) {
            double distance;

            if (line.Length == 0)
            {
                distance = DistanceSq(line.A);
            }
            else
            {
                double t = ((X - line.A.X) * (line.B.X - line.A.X) + (Y - line.A.Y) * (line.B.Y - line.A.Y)) / Math.Pow(line.Length, 2);
                if (t < 0)
                {
                    distance = DistanceSq(line.A);
                }
                else if (t > 1)
                {
                    distance = DistanceSq(line.B);
                }
                else
                {
                    distance = DistanceSq(new Point(line.A.X + t * (line.B.X - line.A.X), line.A.Y + t * (line.B.Y - line.A.Y)));
                }
            }

            return distance;
        }

        public double DistanceP(Point a, Point b) => DistanceP(new Line(a, b));
        public double DistanceP(Line line)
        {
            double result;

            if (line.A.X == line.B.X)
            {
                result = Math.Abs(X - line.A.X);
            }
            else
            {
                double slope = (line.B.Y - line.A.Y) / (line.B.X - line.A.X);
                double intercept = line.A.Y - (slope * line.A.X);
                result = Math.Abs(slope * X - Y + intercept) / Math.Sqrt(Math.Pow(slope, 2) + 1.0);
            }

            return result;
        }
    }
}
