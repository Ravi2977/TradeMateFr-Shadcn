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
} from "@/components/ui/dialog";

import { toast } from "react-toastify";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import Invoice from "@/components/Invoive";

// Helper function to format the date
const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options).replace(/,/g, "");
};

function SaleList() {
  const [salesData, setSalesData] = useState([]);
  const [company] = useState({ companyId: localStorage.getItem("companyId") });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of items per page
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(0);
  const [totalAmountOfSelectedSale, setTotalAmountOfSelectedSale] = useState(0);
  const [receivedAmountOfSelectedSale, setReceivedAmountOfSelectedSale] =
    useState(0);
  const [remainingOfSelected, setRemainingOfSelected] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");

  const onSuccess = () => {
    toast.success("Amount Received");
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
        `/sales/allRemaining`,
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

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount)) {
      toast.error("Please enter a valid amount.");
      return;
    }
    try {
      await axiosInstance.put(`/sales/editsale`, {
        id: selectedSaleId,
        receivedAmmount: amount,
      });
      onSuccess();
      setIsDialogOpen(false); // Close dialog on success
      await loadSaleDetails(); // Reload sale details on success
    } catch (error) {
      console.error("Error receiving amount:", error);
      toast.error("Failed to process the payment.");
    }
  };

  const openDialog = (
    saleId,
    customerName,
    totalAmount,
    receivedAmount,
    remaining
  ) => {
    setIsDialogOpen(true);
    setSelectedSaleId(saleId);
    setRemainingOfSelected(remaining);
    setTotalAmountOfSelectedSale(totalAmount);
    setCustomerName(customerName);
    setReceivedAmountOfSelectedSale(receivedAmount);
  };

  return (
    <div className="overflow-x-auto sm:w-full w-screen">
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
            {/* <TableHead className="px-4 py-2">Select</TableHead> */}
            <TableHead className="px-4 py-2">Sale Date</TableHead>
            <TableHead className="px-4 py-2">Customer Name</TableHead>
            <TableHead className="px-4 py-2">Item Name</TableHead>
            <TableHead className="px-4 py-2">Quantity</TableHead>
            <TableHead className="px-4 py-2">Total Amount(Rs.)</TableHead>
            <TableHead className="px-4 py-2">GST(Rs.)</TableHead>
            <TableHead className="px-4 py-2">Received Amount(Rs.)</TableHead>
            <TableHead className="px-4 py-2">Remaining(Rs.)</TableHead>
            <TableHead className="px-4 py-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSalesData.map((sale) => (
            <TableRow
              key={sale.id}
              className={sale.remaining > 0 ? "highlight" : ""}
            >
              {/* <TableCell className="px-4 py-2 border-b text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.has(sale.id)}
                  onChange={() => handleCheckboxChange(sale.id)}
                />
              </TableCell> */}
              <TableCell className="px-4 py-2 border-b text-center">
                {formatDate(sale.date)}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.customer.customerName}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.item.itemName}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.quantity}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.totalAmmount}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.gstInRupee}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.receivedAmmount}
              </TableCell>
              <TableCell className="px-4 py-2 border-b text-center">
                {sale.remaining}
              </TableCell>
              <TableCell className="flex text-center px-4 py-4 border-b">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {" "}
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="px-2 py-1"
                      >
                        <i
                          className="fa-solid fa-trash fa-lg"
                          style={{ color: "#3e3f41" }}
                        ></i>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <button
                        className="text-white px-1 py-1 rounded"
                        onClick={() =>
                          openDialog(
                            sale.id,
                            sale.customer.customerName,
                            sale.totalAmmount,
                            sale.receivedAmmount,
                            sale.remaining
                          )
                        }
                      >
                        <i
                          className="fa-solid fa-money-bill-1-wave fa-xl"
                          style={{ color: "#3e3f41" }}
                        ></i>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add Received Money</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Dialog>
                  <DialogTrigger>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <button className="text-white px-1 py-1 rounded">
                            <i
                              className="fa-solid fa-file-invoice fa-xl"
                              style={{ color: "#3e3f41" }}
                            ></i>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Invoice</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        Invoice for {sale.customer.customerName}
                      </DialogTitle>
                      <DialogDescription>
                        <Invoice saleId={sale.id} />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Remaining Amount</DialogTitle>
            <DialogDescription>
              <div className="w-full max-w-md bg-white ">
                <div className="mb-4 ">
                  <p>
                    <b>Customer:</b> {customerName}
                  </p>
                  <p>
                    <b>Total Amount:</b> {totalAmountOfSelectedSale}
                  </p>
                  <p>
                    <b>Received Amount:</b> {receivedAmountOfSelectedSale}
                  </p>
                  <p>
                    <b>Remaining Amount:</b> {remainingOfSelected}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left">
                    <Label htmlFor="amount">Enter Amount:</Label>
                    <Input
                      id="amount"
                      value={amount}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit">Receive Amount</Button>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SaleList;
