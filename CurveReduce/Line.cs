using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CurveReduce
{
    public class Line
    {
        public Point A { get; private set; }
        public Point B { get; private set; }
        public double Length
        {
            get
            {
                return A.Distance(B);
            }
        }

        public Line(Point a, Point b)
        {
            A = a;
            B = b;
        }

        public override string ToString()
        {
            return $"Line({A}, {B})";
        }
    }
}
