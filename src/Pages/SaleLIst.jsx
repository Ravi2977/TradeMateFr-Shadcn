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
import { Select } from "@/components/ui/select";

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
  const [pageSize, setPageSize] = useState(20); // Number of items per page
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
  }, [salesData, searchTerm, pageSize]);

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

  const handleItemsPerPageChange = (event) => {
    setPageSize(Number(event.target.value)); // Update items per page
    setCurrentPage(1); // Reset to first page when items per page changes
  };
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
    if (remaining === 0) {
      Swal.fire({
        title: "No Remaining",
        text: `Customer have Paid Complete Amount`,
        icon: "warning",
        // showCancelButton: true,
        confirmButtonText: "OK",
      });
    } else {
      setIsDialogOpen(true);
      setSelectedSaleId(saleId);
      setRemainingOfSelected(remaining);
      setTotalAmountOfSelectedSale(totalAmount);
      setCustomerName(customerName);
      setReceivedAmountOfSelectedSale(receivedAmount);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between px-10">
        <input
          type="text"
          placeholder="Search by customer..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <div>
          <label className="mr-3 sm:flex hidden">Select Items per page</label>
          <select
            id="itemsPerPage"
            value={pageSize}
            onChange={handleItemsPerPageChange}
            className="border border-gray-300 p-2 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <div className=" shadow-md rounded-lg w-full overflow-x-auto">
        <div className="overflow-x-auto sm:w-full w-screen">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">S.No.</TableHead>

                <TableHead className="px-4 py-2">Sale Date</TableHead>
                <TableHead className="px-4 py-2">Customer Name</TableHead>
                <TableHead className="px-4 py-2">Item Name</TableHead>
                <TableHead className="px-4 py-2">Quantity</TableHead>
                <TableHead className="px-4 py-2">Total Amount (Rs.)</TableHead>
                <TableHead className="px-4 py-2">Rate (Rs.)</TableHead>
                <TableHead className="px-4 py-2">
                  Received Amount (Rs.)
                </TableHead>
                <TableHead className="px-4 py-2">Remaining (Rs.)</TableHead>
                <TableHead className="px-4 py-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSalesData.map((sale, index) => (
                <TableRow
                  key={sale.id}
                  className={sale.remaining > 0 ? "highlight" : ""}
                >
                  <TableCell className="px-4 py-2 border-b text-center">
                    {(currentPage - 1) * pageSize + (index + 1)}
                  </TableCell>
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
                    {sale.rate}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b text-center">
                    {sale.receivedAmmount}
                  </TableCell>
                  <TableCell className="px-4 py-2 border-b text-center">
                    {sale.remaining}
                  </TableCell>
                  <TableCell className="flex items-center justify-center px-4 py-4 border-b">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
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
        </div>
      </div>

      <div className="mt-4 overflow-x-auto flex w-80 sm:w-auto ml-10 pl-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className={` ${
                  currentPage === 1 ? "" : "hover:bg-blue-500"
                }  cursor-pointer`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1} // Disable previous button on first page
              />
            </PaginationItem>

            {/* Show the first page */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(1)}
                  className={currentPage === 1 ? "bg-blue-500 text-white" : ""} // Active page styling
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Show an ellipsis if the first page isn't close to the current page */}
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationLink href="#">...</PaginationLink>
              </PaginationItem>
            )}

            {/* Show the pages around the current page */}
            {[...Array(5)].map((_, index) => {
              const page = currentPage - 2 + index;
              if (page > 0 && page <= totalPages) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={() => handlePageChange(page)}
                      className={
                        page === currentPage ? "bg-blue-500 text-white" : ""
                      } // Highlight the active page
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}

            {/* Show an ellipsis if the last page isn't close to the current page */}
            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationLink href="#">...</PaginationLink>
              </PaginationItem>
            )}

            {/* Show the last page */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(totalPages)}
                  className={
                    currentPage === totalPages ? "bg-blue-500 text-white" : ""
                  } // Highlight the active page
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
               className={` ${
                currentPage === totalPages ? "" : "hover:bg-blue-500"
              }  cursor-pointer`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages} // Disable next button on last page
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
              <div className="w-full max-w-md  ">
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
