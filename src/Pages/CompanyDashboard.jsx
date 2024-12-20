import React, { useEffect, useState } from "react";
import { useAuth } from "@/AuthContext/AuthContext";
import axiosInstance from "@/components/AxiosInstance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";
import { ActiveBarChart } from "@/components/Bar-chart";
import { AreaChartSales } from "@/components/ui/SalePurchaseChart";
import { LineChart } from "recharts";
import { LineChartForSalesAndProfits } from "@/components/LineChart";
import ReportOFProductAndCustomer from "@/components/ReportOFProductAndCustomer";

function CompanyDashboard() {
  const { changeValue, setChangeValue } = useAuth();
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dailySalesReport, setDailySalesReport] = useState([]);
  const [customerWiseSaleReport, setCustomerWiseSaleReport] = useState([]);
  const [chartData, setChartData] = useState([]);
  

  const [companyNewInfo, setCompanyNewInfo] = useState({
    companyId: localStorage.getItem("companyId"),
  });
  const [base64Image, setBase64Image] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  useEffect(() => {
    setChangeValue((prev) => prev + 1);
    fetchCompany();
    fetchProductReport();
    fetchDailySalesReport();
    fetchDailySalesReportWithProfit()
    fetchCustomerWiseSalesReport();
  }, []);


   const [chartDataForArea,setChartDataForArea] =useState([]);

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    totalSales: {
      label: "totalSales",
      color: "hsl(var(--chart-1))",
    },
    // totalSales: {
    //   label: "totalSales",
    //   color: "hsl(var(--chart-2))",
    // },
  };

  const [chartDataOfSalesWithProfit,setCHartDataWithProfitOfSales]=useState([])

const chartConfigforSalesProfit = {
    visitors: {
      label: "Visitors",
    },
    totalSales: {
      label: "totalSales",
      color: "hsl(var(--chart-1))",
    },
    profit: {
      label: "totalProfit",
      color: "hsl(var(--chart-2))",
    },
    remainig: {
      label: "totalProfit",
      color: "hsl(var(--chart-3))",
    },
  };
  const fetchCompany = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/getCompanyBYId/${localStorage.getItem("companyId")}`
      );
      setCompany(response.data);
      setCompanyNewInfo(response.data);
      localStorage.setItem("companyDetials",JSON.stringify(response.data))
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchProductReport = async () => {
    const response = await axiosInstance.get(
      `/company/getCompanyProductReport/${localStorage.getItem("companyId")}`
    );
    setChartData(response.data);
  
  };

  const fetchDailySalesReport = async () => {
    const response = await axiosInstance.get(
      `/company/reports/sales/daily/${localStorage.getItem("companyId")}`
    );
    setDailySalesReport(response.data);
    setChartDataForArea(response.data)
    // console.log(response.data)
  };

  const fetchDailySalesReportWithProfit = async () => {
    const response = await axiosInstance.get(
      `/company/reports/sales-profit/daily/${localStorage.getItem("companyId")}`
    );
    setDailySalesReport(response.data);
    setCHartDataWithProfitOfSales(response.data)
    // console.log(response.data)
  };

  const fetchCustomerWiseSalesReport = async () => {
    const response = await axiosInstance.get(
      `/company/reports/sales/customer-wise/${localStorage.getItem(
        "companyId"
      )}`
    );
    setCustomerWiseSaleReport(response.data);
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = async () => {
    try {
      await axiosInstance.post(`/company/updateImage`, companyNewInfo);
      setIsEditing(false);
      fetchCompany();
      toast.success("Details Saved");
    } catch (error) {
      toast.error("Some Error Occured. Try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
        setCompanyNewInfo((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePenClick = () => {
    document.querySelector('input[type="file"]').click();
  };

 
  if (!company) return <div>Loading...</div>;

//   Usage example
// Pass `topProducts` and `topCustomers` as props when rendering the component.
const topProducts = [
  { id: 1, name: 'Product A', quantity: 100 },
  { id: 2, name: 'Product B', quantity: 90 },
  { id: 3, name: 'Product C', quantity: 80 },
  { id: 4, name: 'Product D', quantity: 70 },
  { id: 5, name: 'Product E', quantity: 60 },
];

const topCustomers = [
  { id: 1, name: 'Customer X', totalPurchases: 1000 },
  { id: 2, name: 'Customer Y', totalPurchases: 900 },
  { id: 3, name: 'Customer Z', totalPurchases: 800 },
  { id: 4, name: 'Customer W', totalPurchases: 700 },
  { id: 5, name: 'Customer V', totalPurchases: 600 },
];

  return (
    <div className="p-4 space-y-6">
      {/* Company Information Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">{company.companyName}</h2>
        <p>
          <strong>Mobile:</strong> {company.mobile || "N/A"}
        </p>
        <p>
          <strong>Bank Name:</strong> {company.bankName || "N/A"}
        </p>
        <p>
          <strong>IFSC Code:</strong> {company.ifscCode || "N/A"}
        </p>
        <p>
          <strong>Account Number:</strong>{" "}
          {showAccountNumber ? company.accountNumber || "N/A" : "*************"}
          <button
            className="ml-2"
            onClick={() => setShowAccountNumber((prev) => !prev)}
          >
            {showAccountNumber ? "Hide" : "Show"}
          </button>
        </p>
        <img
          src={company.image}
          alt="Company Sign and Stamp"
          className="mb-4 w-32 h-32 object-cover"
        />
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={handleEdit}>Edit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Company Details</DialogTitle>
              <DialogDescription>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="border p-1 w-full"
                    placeholder="Account Number"
                    value={companyNewInfo.accountNumber || ""}
                    onChange={(e) =>
                      setCompanyNewInfo({
                        ...companyNewInfo,
                        accountNumber: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="border p-1 w-full"
                    placeholder="Bank Name"
                    value={companyNewInfo.bankName || ""}
                    onChange={(e) =>
                      setCompanyNewInfo({
                        ...companyNewInfo,
                        bankName: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="border p-1 w-full"
                    placeholder="IFSC Code"
                    value={companyNewInfo.ifscCode || ""}
                    onChange={(e) =>
                      setCompanyNewInfo({
                        ...companyNewInfo,
                        ifscCode: e.target.value,
                      })
                    }
                  />
                  <Label>Upload Image of your sign with Stamp</Label>
                  <div className="relative mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="border border-gray-300 w-32 h-32 rounded-md flex items-center justify-center relative">
                      {base64Image ? (
                        <img
                          src={base64Image}
                          alt="Uploaded Preview"
                          className="object-cover w-full h-full rounded-md"
                        />
                      ) : (
                        <span className="text-gray-400">No Image Selected</span>
                      )}
                      <PencilIcon
                        onClick={handlePenClick}
                        className="absolute bottom-2 right-2 h-6 w-6 text-gray-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={handleSave}>Save</Button>
                  <Button onClick={() => setIsEditing(false)} className="ml-2">
                    Cancel
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <ReportOFProductAndCustomer topProducts={topProducts} topCustomers={topCustomers}/>

      {/* Chart Section */}

      <div className="bg-white shadow-md rounded-lg p-6">
        <AreaChartSales
          chartData={chartDataOfSalesWithProfit}
          chartConfig={chartConfigforSalesProfit}
        />
        </div>
        <LineChartForSalesAndProfits chartData={chartDataOfSalesWithProfit}/>
        <ActiveBarChart
          chartData={chartData}
          chartTitle="Sales & Purchases"
          xAxisKey="productName"
          barKeys={["salesCount", "purchaseCount"]}
          barColors={["hsl(var(--chart-2))", "hsl(var(--chart-1))"]}
          chartConfig={{
            width: 600,
            height: 200,
            barRadius: [10, 10, 0, 0],
          }}
        />
  
      {/* <div className="bg-white shadow-md rounded-lg p-6">
        <ActiveBarChart
          chartData={dailySalesReport}
          chartTitle="Daily Sales Report"
          xAxisKey="date"
          barKeys={["totalSales"]}
          barColors={["hsl(var(--chart-2))"]}
          chartConfig={{
            width: 600,
            height: 200,
            barRadius: [10, 10, 0, 0],
          }}
        />
      </div> */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <ActiveBarChart
          chartData={customerWiseSaleReport}
          chartTitle="Customer-wise Sales Report"
          xAxisKey="customerName"
          barKeys={["totalSpent"]}
          barColors={["hsl(var(--chart-2))"]}
          chartConfig={{
            width: 600,
            height: 200,
            barRadius: [10, 10, 0, 0],
          }}
        />
      </div>
    </div>
  );
}

export default CompanyDashboard;
