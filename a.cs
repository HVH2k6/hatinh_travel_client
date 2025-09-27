using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace RestaurantMenuApp
{
    public partial class MainForm : Form
    {
        // Danh sách món ăn với giá
        private Dictionary<string, int> menuItems = new Dictionary<string, int>
        {
            {"Bún bò Huế - 25000", 25000},
            {"Bún bò tái - 25000", 25000},
            {"Cháo lòng - 25000", 25000},
            {"Cơm rang - 30000", 30000},
            {"Cơm suất - 25000", 25000},
            {"Phở bò Hưng - 30000", 30000},
            {"Mì quảng - 25000", 25000},
            {"Mì tôm - 30000", 30000}
        };

        private ListBox lstAvailableItems;
        private ListBox lstSelectedItems;
        private Button btnAddOne;
        private Button btnAddAll;
        private Button btnRemoveOne;
        private Button btnRemoveAll;
        private Button btnCalculate;
        private Label lblTotal;
        private Label lblQuantity;

        public MainForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.SuspendLayout();
            
            // Form properties
            this.Text = "Quản lý Menu Nhà Hàng";
            this.Size = new System.Drawing.Size(800, 500);
            this.StartPosition = FormStartPosition.CenterScreen;

            // Available items listbox
            lstAvailableItems = new ListBox();
            lstAvailableItems.Location = new System.Drawing.Point(30, 80);
            lstAvailableItems.Size = new System.Drawing.Size(250, 250);
            lstAvailableItems.SelectionMode = SelectionMode.MultiExtended;
            
            // Load menu items
            foreach (var item in menuItems.Keys)
            {
                lstAvailableItems.Items.Add(item);
            }

            // Selected items listbox
            lstSelectedItems = new ListBox();
            lstSelectedItems.Location = new System.Drawing.Point(450, 80);
            lstSelectedItems.Size = new System.Drawing.Size(250, 250);
            lstSelectedItems.SelectionMode = SelectionMode.MultiExtended;

            // Buttons
            btnAddOne = new Button();
            btnAddOne.Text = ">";
            btnAddOne.Location = new System.Drawing.Point(320, 120);
            btnAddOne.Size = new System.Drawing.Size(40, 30);
            btnAddOne.Click += BtnAddOne_Click;

            btnAddAll = new Button();
            btnAddAll.Text = ">>";
            btnAddAll.Location = new System.Drawing.Point(320, 160);
            btnAddAll.Size = new System.Drawing.Size(40, 30);
            btnAddAll.Click += BtnAddAll_Click;

            btnRemoveOne = new Button();
            btnRemoveOne.Text = "<";
            btnRemoveOne.Location = new System.Drawing.Point(320, 200);
            btnRemoveOne.Size = new System.Drawing.Size(40, 30);
            btnRemoveOne.Click += BtnRemoveOne_Click;

            btnRemoveAll = new Button();
            btnRemoveAll.Text = "<<";
            btnRemoveAll.Location = new System.Drawing.Point(320, 240);
            btnRemoveAll.Size = new System.Drawing.Size(40, 30);
            btnRemoveAll.Click += BtnRemoveAll_Click;

            btnCalculate = new Button();
            btnCalculate.Text = "Tính tiền";
            btnCalculate.Location = new System.Drawing.Point(450, 350);
            btnCalculate.Size = new System.Drawing.Size(100, 35);
            btnCalculate.BackColor = System.Drawing.Color.LightBlue;
            btnCalculate.Click += BtnCalculate_Click;

            // Labels
            Label lblAvailable = new Label();
            lblAvailable.Text = "Danh sách món ăn:";
            lblAvailable.Location = new System.Drawing.Point(30, 50);
            lblAvailable.Size = new System.Drawing.Size(150, 20);
            lblAvailable.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold);

            Label lblSelected = new Label();
            lblSelected.Text = "Món ăn đã chọn:";
            lblSelected.Location = new System.Drawing.Point(450, 50);
            lblSelected.Size = new System.Drawing.Size(150, 20);
            lblSelected.Font = new System.Drawing.Font("Microsoft Sans Serif", 10F, System.Drawing.FontStyle.Bold);

            lblQuantity = new Label();
            lblQuantity.Text = "Số suất chọn: 0";
            lblQuantity.Location = new System.Drawing.Point(450, 340);
            lblQuantity.Size = new System.Drawing.Size(150, 20);

            lblTotal = new Label();
            lblTotal.Text = "Thành tiền: 0 VNĐ";
            lblTotal.Location = new System.Drawing.Point(450, 400);
            lblTotal.Size = new System.Drawing.Size(200, 25);
            lblTotal.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold);
            lblTotal.ForeColor = System.Drawing.Color.Red;

            // Add title
            Label lblTitle = new Label();
            lblTitle.Text = "QUẢN LÝ MENU NHÀ HÀNG";
            lblTitle.Location = new System.Drawing.Point(250, 20);
            lblTitle.Size = new System.Drawing.Size(300, 25);
            lblTitle.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Bold);
            lblTitle.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;

            // Add controls to form
            this.Controls.Add(lstAvailableItems);
            this.Controls.Add(lstSelectedItems);
            this.Controls.Add(btnAddOne);
            this.Controls.Add(btnAddAll);
            this.Controls.Add(btnRemoveOne);
            this.Controls.Add(btnRemoveAll);
            this.Controls.Add(btnCalculate);
            this.Controls.Add(lblAvailable);
            this.Controls.Add(lblSelected);
            this.Controls.Add(lblQuantity);
            this.Controls.Add(lblTotal);
            this.Controls.Add(lblTitle);

            this.ResumeLayout(false);
        }

        private void BtnAddOne_Click(object sender, EventArgs e)
        {
            // Thêm món được chọn sang danh sách đã chọn
            if (lstAvailableItems.SelectedItems.Count > 0)
            {
                var selectedItems = lstAvailableItems.SelectedItems.Cast<string>().ToList();
                foreach (string item in selectedItems)
                {
                    lstSelectedItems.Items.Add(item);
                }
                UpdateQuantityLabel();
            }
            else
            {
                MessageBox.Show("Vui lòng chọn món ăn để thêm!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void BtnAddAll_Click(object sender, EventArgs e)
        {
            // Thêm tất cả món ăn sang danh sách đã chọn
            foreach (string item in lstAvailableItems.Items)
            {
                lstSelectedItems.Items.Add(item);
            }
            UpdateQuantityLabel();
        }

        private void BtnRemoveOne_Click(object sender, EventArgs e)
        {
            // Xóa món được chọn khỏi danh sách đã chọn
            if (lstSelectedItems.SelectedItems.Count > 0)
            {
                var selectedItems = lstSelectedItems.SelectedItems.Cast<string>().ToList();
                foreach (string item in selectedItems)
                {
                    lstSelectedItems.Items.Remove(item);
                }
                UpdateQuantityLabel();
            }
            else
            {
                MessageBox.Show("Vui lòng chọn món ăn để xóa!", "Thông báo", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void BtnRemoveAll_Click(object sender, EventArgs e)
        {
            // Xóa tất cả món ăn khỏi danh sách đã chọn
            lstSelectedItems.Items.Clear();
            UpdateQuantityLabel();
        }

        private void BtnCalculate_Click(object sender, EventArgs e)
        {
            // Tính tổng tiền
            int total = 0;
            var itemCount = new Dictionary<string, int>();

            // Đếm số lượng từng món
            foreach (string item in lstSelectedItems.Items)
            {
                if (itemCount.ContainsKey(item))
                {
                    itemCount[item]++;
                }
                else
                {
                    itemCount[item] = 1;
                }
            }

            // Tính tổng tiền
            foreach (var kvp in itemCount)
            {
                if (menuItems.ContainsKey(kvp.Key))
                {
                    total += menuItems[kvp.Key] * kvp.Value;
                }
            }

            lblTotal.Text = $"Thành tiền: {total:N0} VNĐ";

            // Hiển thị chi tiết hóa đơn
            string bill = "CHI TIẾT HÓA ĐƠN:\n";
            bill += new string('-', 30) + "\n";
            foreach (var kvp in itemCount)
            {
                if (menuItems.ContainsKey(kvp.Key))
                {
                    int itemPrice = menuItems[kvp.Key];
                    bill += $"{kvp.Key}\n";
                    bill += $"SL: {kvp.Value} x {itemPrice:N0} = {(itemPrice * kvp.Value):N0} VNĐ\n";
                    bill += new string('-', 30) + "\n";
                }
            }
            bill += $"TỔNG CỘNG: {total:N0} VNĐ";

            MessageBox.Show(bill, "Hóa đơn thanh toán", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void UpdateQuantityLabel()
        {
            lblQuantity.Text = $"Số suất chọn: {lstSelectedItems.Items.Count}";
        }
    }

    // Program entry point
    public class Program
    {
        [STAThread]
        public static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }
}