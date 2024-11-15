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
      margin: 0.5,
      filename: `${customerModel.customerName}-Invoice.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(invoiceElement).save();
    toast.success("Invoice downloaded as PDF!");
  };

  if (!invoiceData) return <p>Loading...</p>;

  const { customerModel, sales, totalAmount } = invoiceData;

  return (
    <div>
    

      <div
        id="invoice"
        className="p-4 bg-white shadow-md rounded-lg max-w-2xl mx-auto "
      >
        {/* Invoice Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Invoice</h1>
          <p className="text-sm text-gray-500">Invoice #TD{+sales[0]?.id}</p>
        </div>

        {/* Bill To Section */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Bill To:</h2>
          <p>{customerModel.customerName}</p>
          <p>
            {customerModel.address}, {customerModel.state},{" "}
            {customerModel.country} - {customerModel.pinCode}
          </p>
          <p>Email: {customerModel.email}</p>
          <p>Mobile: {customerModel.mobile}</p>
          {customerModel.gstIn && <p>GSTIN: {customerModel.gstIn}</p>}
        </div>

        {/* Company Information */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Bill From:</h2>
          <p>{customerModel.company.companyName}</p>
          <p>
            {customerModel.company.companyAddress},{" "}
            {customerModel.company.district}, {customerModel.company.state}
          </p>
          <p>
            {customerModel.company.country} - {customerModel.company.pinCode}
          </p>
          <p>Mobile: {customerModel.company.mobile}</p>

          {/* Highlighted Account Details */}
          <div className="bg-yellow-100 p-4 rounded-md mt-4">
            <h2 className="text-lg font-semibold mb-2">Account Details</h2>
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="font-semibold py-1 pr-4">Bank:</td>
                  <td>{customerModel.company.bankName}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 pr-4">
                    Account Holder Name:
                  </td>
                  <td>{customerModel.company.companyName}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 pr-4">Account Number:</td>
                  <td>{customerModel.company.accountNumber}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1 pr-4">IFSC Code:</td>
                  <td>{customerModel.company.ifscCode}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conditional GST Information */}
          {customerModel.company.gstIn && (
            <p className="mt-2">GSTIN: {customerModel.company.gstIn}</p>
          )}
        </div>

        {/* Sales Items Table */}
        <Table className="mb-4">
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
        <div className="flex justify-between items-center mt-6">
          <div className="flex flex-col items-center">
            <p className="font-semibold">Authorized Signature & Stamp</p>
            <div className="w-36 h-32 border border-gray-300 mt-2">
              <img
                src={customerModel.company.image}
                alt="Signature & Stamp"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Terms and Conditions - Bottom of Invoice */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold">Terms & Conditions</h2>
          <ul className="text-sm text-gray-600 list-disc ml-4 mt-2">
            <li>Goods once sold Will not be returned or Refunded.</li>
            <li>All taxes are applicable as per government regulations.</li>
            <li>
              For any queries regarding this invoice, please contact us at
              ravicomputercompany@gmail.com.
            </li>
          </ul>
        </div>
      </div>
      <Button className="w-full mt-4" onClick={handlePrint}>
        Print Invoice
      </Button>
    </div>
  );
};

export default Invoice;
