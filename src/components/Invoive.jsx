import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
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

  const [company] = useState(
    JSON.parse(localStorage.getItem("companyDetials"))
  );

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const fetchInvoiceData = async () => {
    try {
      const response = await axiosInstance.post(`/sales/byid/${saleId}`);
      setInvoiceData(response.data);
    } catch (error) {
      toast.error("Failed to fetch invoice data");
    }
  };

  const handlePrint = () => {
    const invoiceElement = document.getElementById("invoice");

    const options = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: `${invoiceData?.customerModel?.customerName}-Invoice.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(options).from(invoiceElement).save();
    toast.success("Invoice downloaded!");
  };

  if (!invoiceData) return <p>Loading...</p>;

  const { customerModel, sales, totalAmount } = invoiceData;

  const taxableAmount = totalAmount / 1.18;
  const cgst = taxableAmount * 0.09;
  const sgst = taxableAmount * 0.09;

  function formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  }

  return (
    <div className="bg-white">

      <div
        id="invoice"
        className="relative bg-white text-black shadow-md rounded-lg max-w-3xl mx-auto text-xs p-4"
      >

        {/* WATERMARK */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-6xl font-bold text-gray-200 opacity-60 rotate-[-30deg]">
            Ventra Enterprises
          </h1>
        </div>

        {/* GST HEADER */}
        <div className="flex justify-between border-b pb-1 text-[11px] font-semibold relative z-10">
          <span>GSTIN : {company.gstIn}</span>
          <span className="font-bold">TAX INVOICE</span>
          <span></span>
        </div>

        {/* COMPANY HEADER */}
        <div className="flex items-center justify-between border-b py-3 relative z-10">



          <div className="text-center flex-1">
            <h1 className="text-lg font-bold">{company.companyName}</h1>
            <p>
              {company.companyAddress}, {company.district}, {company.state}
            </p>
            <p>{company.country} - {company.pinCode}</p>
            <p>Mobile : {company.mobile}</p>
          </div>

        </div>

        {/* BILL SECTION */}

        <div className="grid grid-cols-2 border-b text-xs relative z-10">

          <div className="p-2 border-r">

            <p className="font-semibold">Bill To :</p>

            <p className="font-bold">{customerModel.customerName}</p>

            <p>
              {customerModel.address}, {customerModel.state}
            </p>

            <p>Mobile : {customerModel.mobile}</p>

            {customerModel.gstIn && (
              <p>GSTIN : {customerModel.gstIn}</p>
            )}

          </div>

          <div className="p-2">

            <p>Invoice No : <b>TD{sales[0]?.id}</b></p>

            <p>Date : {formatDate(sales[0].date)}</p>

            <p>Place of Supply : {customerModel.state}</p>

          </div>

        </div>


        {/* SALES TABLE */}

        <Table className="w-full text-xs border mt-2 relative z-10">

          <TableHeader>

            <TableRow className="bg-gray-200">

              <TableCell className="border font-semibold">S.No</TableCell>

              <TableCell className="border font-semibold">Description</TableCell>

              <TableCell className="border font-semibold text-center">
                Qty
              </TableCell>

              <TableCell className="border font-semibold text-center">
                Rate
              </TableCell>

              <TableCell className="border font-semibold text-center">
                Amount
              </TableCell>

            </TableRow>

          </TableHeader>


          <TableBody>

            {sales.map((sale, index) => (

              <TableRow key={index}>

                <TableCell className="border">{index + 1}</TableCell>

                <TableCell className="border">
                  {sale.item.itemName}
                </TableCell>

                <TableCell className="border text-center">
                  {sale.quantity}
                </TableCell>

                <TableCell className="border text-center">
                  ₹{sale.rate.toFixed(2)}
                </TableCell>

                <TableCell className="border text-center">
                  ₹{sale.totalAmmount.toFixed(2)}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>


        {/* GST SUMMARY */}

        <div className="flex justify-end mt-3 relative z-10">

          <table className="w-72 text-xs border">

            <tbody>

              <tr>
                <td className="border p-1">Taxable Amount</td>
                <td className="border text-right p-1">
                  ₹{taxableAmount.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td className="border p-1">CGST (9%)</td>
                <td className="border text-right p-1">
                  ₹{cgst.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td className="border p-1">SGST (9%)</td>
                <td className="border text-right p-1">
                  ₹{sgst.toFixed(2)}
                </td>
              </tr>

              <tr className="font-bold bg-gray-100">

                <td className="border p-1">Total Amount</td>

                <td className="border text-right p-1">
                  ₹{totalAmount.toFixed(2)}
                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* FOOTER */}

        <div className="grid grid-cols-2 mt-4 text-xs border-t pt-2 relative z-10">

          <div>

            <p className="font-semibold">Bank Details</p>

            <p>Bank : {company.bankName}</p>

            <p>A/C No : {company.accountNumber}</p>

            <p>IFSC : {company.ifscCode}</p>

          </div>


          <div className="text-right">

            <p className="font-semibold">
              For {company.companyName}
            </p>

            <div className="h-16"></div>
            <div className="flex flex-col items-end justify-end gap-1">
              <div className="w-24">
                <img src={company.image} className="w-full object-contain" />
              </div>
              <p className="border-t pt-1">
                Authorised Signatory
              </p>
            </div>

          </div>

        </div>


        {/* TERMS */}

        <div className="mt-3 text-[10px] border-t pt-2 relative z-10">

          <p className="font-semibold">Terms & Conditions</p>

          <ul className="list-disc ml-4">

            <li>Goods once sold will not be returned.</li>

            <li>All taxes applicable as per government rules.</li>

            <li>
              For queries contact : enterprisesventra@gmail.com
            </li>

          </ul>

        </div>

       <div className="mt-4 border-t pt-3 text-center relative z-10">

  <p className="text-[10px] text-gray-500 mb-2">
    This is a computer-generated invoice and does not require a signature.
  </p>

  <div className="bg-gray-50 rounded-md py-3 px-4">

    <h2 className="text-sm font-semibold text-gray-800">
      Thank You for Choosing Ventra Enterprises
    </h2>

    <p className="text-[11px] text-gray-600 mt-1">
      We truly appreciate your business and look forward to serving you again.
    </p>

  </div>

</div>

      </div>


      {/* PRINT BUTTON */}

      <div className="flex justify-center mt-3">

        <Button
          className="bg-black text-white w-40"
          onClick={handlePrint}
        >
          Print Invoice
        </Button>

      </div>

    </div>
  );
};

export default Invoice;