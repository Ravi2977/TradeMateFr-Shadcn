import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import axiosInstance from "@/components/AxiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options).replace(/,/g, "");
};

function ReamingSale() {
  const [salesData, setSalesData] = useState([]);
  const [company] = useState({ companyId: localStorage.getItem("companyId") });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of items per page
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSuccess = () => {
    toast.success("Amount Received");
    setIsDialogOpen(false); // Close the dialog on success
  };

  useEffect(() => {
    loadSaleDetails();
  }, []);

  useEffect(() => {
    // Update total pages whenever filtered data changes
    setTotalPages(Math.ceil(filteredSalesData.length / pageSize));
  }, [salesData, searchTerm]);

  const loadSaleDetails = async () => {
    try {
      const saleDetail = await axiosInstance.post(
        `/sales/allsaledetails`,
        company
      );
      setSalesData(saleDetail.data);
    } catch (error) {
      console.error("Error loading sale details:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCheckboxChange = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const filteredSalesData = salesData.filter((sale) =>
    sale.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentSalesData = filteredSalesData.slice(
    startIndex,
    startIndex + pageSize
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You Want Delete this sale`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/sales/delete/${id}`);
          toast.success("Deleted");
          await loadSaleDetails(); // Refresh data after successful deletion
        } catch (error) {
          toast.error("Some error occurs");
        }
      }
    });
  };

  //dilog recevie amount
  const [amount, setAmount] = useState("");

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e, saleId) => {
    e.preventDefault();

    if (!amount || isNaN(amount) ) {
      toast.error("Please enter a valid amount.");
      return;
    }
    try {
      await axiosInstance.put(`/sales/editsale`, {
        id: saleId,
        receivedAmmount: amount,
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error receiving amount:", error);
      toast.error("Failed to process the payment.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <input
        type="text"
        placeholder="Search by customer..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <Table className="min-w-full bg-white shadow-md rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 border-b">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    const allIds = currentSalesData.map((sale) => sale.id);
                    setSelectedRows(new Set(allIds));
                  } else {
                    setSelectedRows(new Set());
                  }
                }}
              />
            </TableHead>
            <TableHead className="px-4 py-2 border-b">Date</TableHead>
            <TableHead className="px-4 py-2 border-b">Customer Name</TableHead>
            <TableHead className="px-4 py-2 border-b">Customer Email</TableHead>
            <TableHead className="px-4 py-2 border-b">Quantity</TableHead>
            <TableHead className="px-4 py-2 border-b">Rate</TableHead>
            <TableHead className="px-4 py-2 border-b">Total Amount</TableHead>
            <TableHead className="px-4 py-2 border-b">
              Received Amount
            </TableHead>
            <TableHead className="px-4 py-2 border-b">
              Remaining Amount
            </TableHead>
            <TableHead className="px-4 py-2 border-b">Purchase Item</TableHead>
            <TableHead className="px-4 py-2 border-b text-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSalesData.filter((sale)=>sale.remaining>0).map((sale) => (
            <TableRow
              key={sale.id}
              className={sale.remaining > 0 ? "highlight" : ""}
            >
              <TableCell className="px-4 py-2 border-b">
                <input
                  type="checkbox"
                  checked={selectedRows.has(sale.id)}
                  onChange={() => handleCheckboxChange(sale.id)}
                />
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {formatDate(sale.date)}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.customer.customerName}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.customer.email}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.quantity}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">{sale.rate}</TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.totalAmmount}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.receivedAmmount}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.remaining}
              </TableCell>
              <TableCell className="px-4 py-2 border-b">
                {sale.item.itemName}
              </TableCell>
              <TableCell className=" flex text-center px-4 py-4 border-b">
                <Dialog onOpenChange={loadSaleDetails} >
                  <DialogTrigger>
                    <button
                      className="text-white px-1 py-1 rounded mr-2"
                      onClick={() => setIsDialogOpen(true)} // Open dialog on button click
                    >
                      <i
                        className="fa-solid fa-money-bill-1-wave fa-xl"
                        style={{ color: "#3e3f41" }}
                      ></i>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Receive Remaining Amount</DialogTitle>
                      <DialogDescription>
                        <div className="w-full max-w-md bg-white ">
                          <div className="mb-4 text-center">
                            <p>
                              <strong>Customer:</strong>
                              {sale.customer.customerName}
                            </p>
                            <p>
                              <strong>Total Paid:</strong> Rs.
                              {sale.receivedAmmount}
                            </p>
                            <p>
                              <strong>Remaining Balance:</strong> Rs.
                              {sale.remaining}
                            </p>
                          </div>
                          <form
                            onSubmit={(e) => handleSubmit(e, sale.id)}
                            className="flex flex-col items-center"
                          >
                            <Label htmlFor="amount" className="mb-2">
                              Amount to Receive(Rs.)
                            </Label>
                            <Input
                              id="amount"
                              type="number"
                              value={amount}
                              onChange={handleInputChange}
                              placeholder="Enter amount"
                              className="mb-4"
                            />
                            <Button
                              type="submit"
                              className="w-full bg-blue-600 text-white"
                            >
                              Receive Amount
                            </Button>
                          </form>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <button
                        className=" text-white px-1 py-1 rounded"
                        onClick={() => handleInvoice(sale.id)}
                      >
                        <i
                          class="fa-solid fa-file-invoice fa-xl"
                          style={{ color: "#3e3f41" }}
                        ></i>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Invoice</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {[...Array(totalPages).keys()].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  active={page + 1 === currentPage}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default ReamingSale;
