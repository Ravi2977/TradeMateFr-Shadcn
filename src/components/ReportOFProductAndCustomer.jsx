import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import axiosInstance from "./AxiosInstance";
import { AwardIcon } from "lucide-react";

const ReportOFProductAndCustomer = () => {
  const [topProducts, setTop5Products] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const fetchTop5Products = async () => {
    const response = await axiosInstance.get(
      `/stock/getTop5Items/${localStorage.getItem("companyId")}`
    );
    setTop5Products(response.data);
  };

  const fetchTop5Customers = async () => {
    const response = await axiosInstance.get(
      `/customer/getTop5customer/${localStorage.getItem("companyId")}`
    );
    setTopCustomers(response.data);
  };

  useEffect(() => {
    fetchTop5Customers();
    fetchTop5Products();
  }, []);

  return (
    <div className="gap-6 flex flex-col md:flex-row">
      {/* Top 5 Most Sold Products */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Sold quantity Products</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto max-h-[400px]">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">S.No.</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Sold Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{product[0]}</TableCell>
                  <TableCell>{product[1]} pieces</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top 5 Customers */}
      <Card className="flex-1 mt-6 md:mt-0">
        <CardHeader>
          <CardTitle>Spent by Customers</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto max-h-[400px]">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableCell className="text-center">S.No.</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Purchases</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}.</TableCell>
                  <TableCell>{customer[0]}</TableCell>
                  <TableCell>Rs. {customer[1]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportOFProductAndCustomer;
