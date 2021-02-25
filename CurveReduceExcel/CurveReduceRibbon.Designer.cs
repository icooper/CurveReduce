
namespace CurveReduce.Excel
{
    partial class CurveReduceRibbon : Microsoft.Office.Tools.Ribbon.RibbonBase
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        public CurveReduceRibbon()
            : base(Globals.Factory.GetRibbonFactory())
        {
            InitializeComponent();
        }

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.DataTab = this.Factory.CreateRibbonTab();
            this.CurveReduceGroup = this.Factory.CreateRibbonGroup();
            this.PointsEdit = this.Factory.CreateRibbonEditBox();
            this.SimplifyButton = this.Factory.CreateRibbonButton();
            this.DataTab.SuspendLayout();
            this.CurveReduceGroup.SuspendLayout();
            this.SuspendLayout();
            // 
            // DataTab
            // 
            this.DataTab.ControlId.ControlIdType = Microsoft.Office.Tools.Ribbon.RibbonControlIdType.Office;
            this.DataTab.ControlId.OfficeId = "TabData";
            this.DataTab.Groups.Add(this.CurveReduceGroup);
            this.DataTab.Label = "TabData";
            this.DataTab.Name = "DataTab";
            // 
            // CurveReduceGroup
            // 
            this.CurveReduceGroup.Items.Add(this.PointsEdit);
            this.CurveReduceGroup.Items.Add(this.SimplifyButton);
            this.CurveReduceGroup.Label = "CurveReduce";
            this.CurveReduceGroup.Name = "CurveReduceGroup";
            // 
            // PointsEdit
            // 
            this.PointsEdit.Label = "Points";
            this.PointsEdit.Name = "PointsEdit";
            this.PointsEdit.ScreenTip = "Number of points";
            this.PointsEdit.SizeString = "000";
            this.PointsEdit.SuperTip = "Specify the target number of points in the reduced curve.";
            this.PointsEdit.Text = "20";
            // 
            // SimplifyButton
            // 
            this.SimplifyButton.Label = "Simplify Curve";
            this.SimplifyButton.Name = "SimplifyButton";
            this.SimplifyButton.ScreenTip = "Simplify selected curve data";
            this.SimplifyButton.SuperTip = "With selected data having colums treated like X and Y, simplify the curve to the " +
    "target number of points.";
            // 
            // CurveReduceRibbon
            // 
            this.Name = "CurveReduceRibbon";
            this.RibbonType = "Microsoft.Excel.Workbook";
            this.Tabs.Add(this.DataTab);
            this.Load += new Microsoft.Office.Tools.Ribbon.RibbonUIEventHandler(this.CRRibbon_Load);
            this.DataTab.ResumeLayout(false);
            this.DataTab.PerformLayout();
            this.CurveReduceGroup.ResumeLayout(false);
            this.CurveReduceGroup.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        internal Microsoft.Office.Tools.Ribbon.RibbonTab DataTab;
        internal Microsoft.Office.Tools.Ribbon.RibbonGroup CurveReduceGroup;
        internal Microsoft.Office.Tools.Ribbon.RibbonEditBox PointsEdit;
        internal Microsoft.Office.Tools.Ribbon.RibbonButton SimplifyButton;
    }

    partial class ThisRibbonCollection
    {
        internal CurveReduceRibbon CRRibbon
        {
            get { return this.GetRibbon<CurveReduceRibbon>(); }
        }
    }
}
