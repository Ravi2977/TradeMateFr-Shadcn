import React, { useEffect, useState, useMemo } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axiosInstance from "@/components/AxiosInstance";

export default function GstReport() {

  const [inputGst, setInputGst] = useState([]);
  const [outputGst, setOutputGst] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGstReport = async () => {

    setLoading(true);

    try {

      const response = await axiosInstance.get(
        `/gst/get-gst-report?companyId=${localStorage.getItem("companyId")}`
      );

      const data = response.data;

      setInputGst(data[0]?.inputGst || []);
      setOutputGst(data[1]?.outpurGst || []);

    } catch (error) {
      console.error("GST Fetch Error", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGstReport();
  }, []);

  // Date format function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter Logic
  const filteredInput = useMemo(() => {
    return inputGst.filter((item) => {

      if (!month && !year) return true;

      const d = new Date(item.date);

      return (
        (!month || d.getMonth() + 1 === Number(month)) &&
        (!year || d.getFullYear() === Number(year))
      );
    });
  }, [inputGst, month, year]);

  const filteredOutput = useMemo(() => {
    return outputGst.filter((item) => {

      if (!month && !year) return true;

      const d = new Date(item.date);

      return (
        (!month || d.getMonth() + 1 === Number(month)) &&
        (!year || d.getFullYear() === Number(year))
      );
    });
  }, [outputGst, month, year]);



  // GST Calculations

  const totalInputGst = filteredInput.reduce(
    (sum, item) => sum + item.inputGst,
    0
  );

  const totalOutputGst = filteredOutput.reduce(
    (sum, item) => sum + item.outputGst,
    0
  );

  const netGst = totalOutputGst - totalInputGst;

  const status =
    netGst > 0 ? "GST Payable to Government" : "ITC Claimable / Carry Forward";



  return (
    <div className="space-y-6 p-4">

      {/* Filters */}

      <div className="flex gap-4">

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">All Months</option>

          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>



        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>

          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y}>{y}</option>
          ))}

        </select>

      </div>



      {/* GST SUMMARY */}

      <div className="grid grid-cols-3 gap-4">

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Input GST (ITC)</p>
          <p className="text-xl font-semibold">₹ {totalInputGst.toFixed(2)}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">Total Output GST</p>
          <p className="text-xl font-semibold">₹ {totalOutputGst.toFixed(2)}</p>
        </div>

        <div className="border rounded p-4">
          <p className="text-sm text-gray-500">{status}</p>
          <p
            className={`text-xl font-semibold ${
              netGst > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            ₹ {Math.abs(netGst).toFixed(2)}
          </p>
        </div>

      </div>



      {/* INPUT GST TABLE */}

      <div>

        <h2 className="text-lg font-semibold mb-3">
          Input GST (Purchases)
        </h2>

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Purchase Without GST</TableHead>
              <TableHead>Input GST</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filteredInput.map((item, index) => (

              <TableRow key={index}>
                <TableCell>{formatDate(item.date)}</TableCell>

                <TableCell>
                  ₹ {item.purchaseWithoutGst.toFixed(2)}
                </TableCell>

                <TableCell>
                  ₹ {item.inputGst.toFixed(2)}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>



      {/* OUTPUT GST TABLE */}

      <div>

        <h2 className="text-lg font-semibold mb-3">
          Output GST (Sales)
        </h2>

        <Table>

          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Output GST</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {filteredOutput.map((item, index) => (

              <TableRow key={index}>
                <TableCell>{formatDate(item.date)}</TableCell>

                <TableCell>
                  ₹ {item.outputGst.toFixed(2)}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

    </div>
  );
}