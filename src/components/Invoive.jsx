import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "./AxiosInstance";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const Invoice = ({ saleId }) => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [company, setCompany] = useState(
    JSON.parse(localStorage.getItem("companyDetials"))
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const response = await axiosInstance.post(`/sales/byid/${saleId}`);
      setInvoiceData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching invoice data", error);
      toast.error("Failed to fetch invoice data");
    }
  };

  const handlePrint = () => {
    const invoiceElement = document.getElementById("invoice");
    const options = {
      margin: [0.2, 0.2, 0.2, 0.2], // Reduced margins
      filename: `${invoiceData?.customerModel?.customerName}-Invoice.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(invoiceElement).save();
    toast.success("Invoice downloaded as PDF!");
  };

  if (!invoiceData) return <p>Loading...</p>;

  const { customerModel, sales, totalAmount } = invoiceData;

  function formatDate(date) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date if it's not
    }
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  }

  return (
    <div className="bg-white rounded">
      <div
        id="invoice"
        className="p-2 bg-white text-black shadow-md rounded-lg max-w-2xl mx-auto text-xs" // Smaller text size
      >
        {/* Invoice Header */}
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">Invoice</h1>
          <p className="text-xs text-gray-500">Invoice #TD{+sales[0]?.id}</p>
        </div>

        {/* Bill To Section */}
        <div className="flex justify-between pr-10">
          <div className="mb-2">
            <h2 className="font-semibold">Bill To:</h2>
            <p>{customerModel.customerName}</p>
            <p>
              {customerModel.address}, {customerModel.state},{" "}
              {customerModel.country} - {customerModel.pinCode}
            </p>
            <p>Email: {customerModel.email}</p>
            <p>Mobile: {customerModel.mobile}</p>
            {customerModel.gstIn && <p>GSTIN: {customerModel.gstIn}</p>}
          </div>
          <div>Date :- {formatDate(sales[0].date)}</div>
        </div>

        {/* Company Information */}
        <div className="mb-2">
          <h2 className="font-semibold">Bill From:</h2>
          <p>{company.companyName}</p>
          <p>
            {company.companyAddress}, {company.district}, {company.state}
          </p>
          <p>
            {company.country} - {company.pinCode}
          </p>
          <p>Mobile: {company.mobile}</p>

          {/* Highlighted Account Details */}
          <div className="bg-yellow-50 p-2 rounded-md mt-2 text-xs">
            <h2 className="font-semibold mb-1">Account Details</h2>
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="font-semibold py-1 pr-2">Bank:</td>
                  <td>{company.bankName}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 pr-2">
                    Account Holder Name:
                  </td>
                  <td>{company.companyName}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 pr-2">Account Number:</td>
                  <td>{company.accountNumber}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 pr-2">IFSC Code:</td>
                  <td>{company.ifscCode}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conditional GST Information */}
          {company.gstIn && <p className="mt-2">GSTIN: {company.gstIn}</p>}
        </div>

        {/* Sales Items Table */}
        <Table className="mb-4 text-xs">
          <TableHeader>
            <TableRow>
              <TableCell className="font-semibold">Item</TableCell>
              <TableCell className="font-semibold">Quantity</TableCell>
              <TableCell className="font-semibold">Unit Price</TableCell>
              <TableCell className="font-semibold">Total</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell>{sale.item.itemName}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>₹{sale.rate.toFixed(2)}</TableCell>
                <TableCell>₹{sale.totalAmmount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Total Amount */}
        <div className="flex justify-between font-semibold mt-4">
          <span>Total Amount:</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>

        {/* Signature and Stamp Section */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col items-center">
            <p className="font-semibold">Authorized Signature & Stamp</p>
            <div className="w-24 h-20 border border-gray-300 mt-3">
              <img
                src={company.image}
                alt="Signature & Stamp"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mt-4 border-t border-gray-200 pt-2 text-xs">
          <h2 className="font-semibold">Terms & Conditions</h2>
          <ul className="list-disc ml-4">
            <li>Goods once sold will not be returned or refunded.</li>
            <li>All taxes are applicable as per government regulations.</li>
            <li>
              For any queries regarding this invoice, please contact us at
              ravicomputercompany@gmail.com.
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center">
        <Button className=" m-2 bg-black text-white w-40" onClick={handlePrint}>
          Print Invoice
        </Button>
      </div>
    </div>
  );
};

export default Invoice;
