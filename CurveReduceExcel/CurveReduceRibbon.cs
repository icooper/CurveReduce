using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Windows.Forms;

using Microsoft.Office.Interop.Excel;
using Microsoft.Office.Tools.Excel;
using Microsoft.Office.Tools.Ribbon;

using CR = CurveReduce;

namespace CurveReduce.Excel
{
    public partial class CurveReduceRibbon
    {
        private void CRRibbon_Load(object sender, RibbonUIEventArgs e)
        {
            SimplifyButton.Click += SimplifyButton_Click;
            PointsEdit.TextChanged += PointsEdit_TextChanged;
        }

        private void PointsEdit_TextChanged(object sender, RibbonControlEventArgs e)
        {
            bool useDefault = true;
            if (!int.TryParse(PointsEdit.Text, out int result))
            {
                if (result > 2)
                {
                    useDefault = false;
                }
            }

            if (useDefault)
            {
                MessageBox.Show("Target points count should be an integer greater than 2, defaulting to 20.", "CurveReduce");
                PointsEdit.Text = "20";
            }
        }

        private void SimplifyButton_Click(object sender, RibbonControlEventArgs e)
        {
            int pointCount = int.Parse(PointsEdit.Text);
            Range range = null;
            try
            {
                range = Globals.ThisAddIn.Application.Selection;
            }
            catch (Exception)
            {
                // just absorb any errors, probably if the user doesn't have anything selected
            }

            if (range != null)
            {
                if (range.Columns.Count == 2)
                {
                    if (range.Rows.Count > pointCount)
                    {
                        // read the selected data
                        List<CR.Point> points = new List<CR.Point>(range.Rows.Count);
                        foreach (Range row in range.Rows)
                        {
                            if (double.TryParse(row.Value2[1, 1].ToString(), out double x))
                            {
                                if (double.TryParse(row.Value2[1, 2].ToString(), out double y))
                                {
                                    points.Add(new CR.Point(x, y));
                                }
                            }
                        }

                        // simplify to the requested number of points
                        IList<CR.Point> simplified = points.SimplifyTo(pointCount);
                        int simplifiedCount = simplified.Count();

                        // clear the selection
                        range.ClearContents();

                        // write out the simplified range
                        int r = 0;
                        foreach (Range row in range.Rows)
                        {
                            Point p = simplified[r];
                            row.Cells[1, 1] = p.X;
                            row.Cells[1, 2] = p.Y;

                            if (++r >= simplifiedCount) break;
                        }
                    }
                    else
                    {
                        MessageBox.Show("Target points count is less than the number of selected rows.", "CurveReduce");
                    }
                }
                else
                {
                    MessageBox.Show("Please select only two columns of data and try again.", "CurveReduce");
                }
            }
            else
            {
                MessageBox.Show("It seems like nothing is selected. Please select two columns of data and try again.", "CurveReduce");
            }
        }
    }
}
