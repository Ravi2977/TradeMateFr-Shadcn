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


// Helper function to format the date
const formatDate = (dateString) => {
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options).replace(/,/g, "");
};

function PurchaseList() {
  const [purchasesData, setPurchasesData] = useState([]);
  const [company] = useState({ companyId: localStorage.getItem("companyId") });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of items per page
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(0);
  const [totalAmountOfSelectedPurchase, setTotalAmountOfSelectedPurchase] = useState(0);
  const [paidAmountOfSelectedPurchase, setPaidAmountOfSelectedPurchase] = useState(0);
  const [remainingOfSelected, setRemainingOfSelected] = useState(0);
  const [sellerName, setsellerName] = useState("");
  const [amount, setAmount] = useState("");

  const onSuccess = () => {
    toast.success("Amount Paid");
  };

  useEffect(() => {
    loadPurchaseDetails();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPurchasesData.length / pageSize));
  }, [purchasesData, searchTerm]);

  const loadPurchaseDetails = async () => {
    try {
      const purchaseDetail = await axiosInstance.get(`/purchase/getbycompany/${company.companyId}`, company);
      setPurchasesData(purchaseDetail.data);
    } catch (error) {
      console.error("Error loading purchase details:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredPurchasesData = purchasesData.filter((purchase) =>
    purchase.seller.sellerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentPurchasesData = filteredPurchasesData.slice(
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
      text: `You want to delete this purchase?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/purchases/delete/${id}`);
          toast.success("Deleted");
          await loadPurchaseDetails();
        } catch (error) {
          toast.error("Some error occurred");
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
      await axiosInstance.post(`/purchase/update`, {
        id: selectedPurchaseId,
        paidAmount: amount,
      });
      onSuccess();
      setIsDialogOpen(false);
      await loadPurchaseDetails();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process the payment.");
    }
  };

  const openDialog = (
    purchaseId,
    sellerName,
    totalAmount,
    paidAmount,
    remaining
  ) => {
    setIsDialogOpen(true);
    setSelectedPurchaseId(purchaseId);
    setRemainingOfSelected(remaining);
    setTotalAmountOfSelectedPurchase(totalAmount);
    setsellerName(sellerName);
    setPaidAmountOfSelectedPurchase(paidAmount);
  };

  return (
    <div className="">
      <input
        type="text"
        placeholder="Search by seller..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <div className="bg-white shadow-md rounded-lg overflow-x-auto sm:w-full w-screen">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2">Purchase Date</TableHead>
              <TableHead className="px-4 py-2">seller Name</TableHead>
              <TableHead className="px-4 py-2">Item Name</TableHead>
              <TableHead className="px-4 py-2">Quantity</TableHead>
              <TableHead className="px-4 py-2">Unit Price</TableHead>
              <TableHead className="px-4 py-2">Total Amount (Rs.)</TableHead>
              <TableHead className="px-4 py-2">GST (Rs.)</TableHead>
              <TableHead className="px-4 py-2">Paid Amount (Rs.)</TableHead>
              <TableHead className="px-4 py-2">Remaining (Rs.)</TableHead>
              <TableHead className="px-4 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPurchasesData.map((purchase) => (
              <TableRow
                key={purchase.id}
                className={purchase.remaining > 0 ? "highlight" : ""}
              >
                <TableCell className="px-4 py-2 border-b text-center">
                  {formatDate(purchase.date)}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.seller.sellerName}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.item.itemName}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.quantity}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.price}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.totalAmount}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.gstInRupee}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.paidAmount}
                </TableCell>
                <TableCell className="px-4 py-2 border-b text-center">
                  {purchase.remaining}
                </TableCell>
                <TableCell className="flex items-center justify-center px-4 py-4 border-b">
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          onClick={() => handleDelete(purchase.id)}
                          className="px-2 py-1"
                        >
                          <i className="fa-solid fa-trash fa-lg" style={{ color: "#3e3f41" }}></i>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> */}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          className="text-white px-1 py-1 rounded"
                          onClick={() =>
                            openDialog(
                              purchase.id,
                              purchase.seller.sellerName,
                              purchase.totalAmount,
                              purchase.paidAmount,
                              purchase.remaining
                            )
                          }
                        >
                          <i className="fa-solid fa-money-bill-1-wave fa-xl" style={{ color: "#3e3f41" }}></i>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Payment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="flex justify-center mt-4">
        <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
        <PaginationContent>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i} active={i + 1 === currentPage}>
              <PaginationLink onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
      </Pagination>

      {/* Dialog for Receiving Payment */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Payment</DialogTitle>
            <DialogDescription>
              <Label>
                seller: {sellerName}
                <br />
                Total Amount: {totalAmountOfSelectedPurchase}
                <br />
                Amount Paid: {paidAmountOfSelectedPurchase}
                <br />
                Remaining Amount: {remainingOfSelected}
              </Label>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <Input
              type="number"
              min="0"
              max={remainingOfSelected}
              step="any"
              placeholder="Enter amount"
              value={amount}
              onChange={handleInputChange}
              required
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                className="mt-4 bg-blue-600 text-white"
                onClick={() => setIsDialogOpen(false)}
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PurchaseList;

