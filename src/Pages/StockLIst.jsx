import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/AxiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationContent,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10); // Tracks rows per page
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productName, setProdcutName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productNewPrice, setNewPrice] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(0);

  const company = { companyId: localStorage.getItem("companyId") };

  useEffect(() => {
    fetchStocks();
  }, [isDialogOpen]);

  const fetchStocks = async () => {
    try {
      const response = await axiosInstance.get(
        `/stock/all/${company.companyId}`
      );
      setStocks(response.data);
    } catch (err) {
      setError("Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on rows change
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const displayedStocks = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDialog = (stock) => {
    setSelectedProductId(stock.itemId);
    setProdcutName(stock.itemName);
    setProductPrice(stock.purchasePrice);
    setNewPrice(stock.purchasePrice);
    setIsDialogOpen(true);
  };

  const updatePrice = async () => {
    try {
      await axiosInstance.put(`/stock/updateStock`, {
        purchasePrice: productNewPrice,
        itemId: selectedProductId,
        itemName: productName,
      });
      setIsDialogOpen(false);
      toast.success("New Price Updated");
      fetchStocks(); // Refresh the stock list
    } catch (error) {
      toast.error("Some Error Occurred");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto sm:w-full w-screen">
      <h2 className="text-xl font-semibold mb-4">Stock List</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          value={itemsPerPage}
          onChange={handleRowsPerPageChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="5">5 rows per page</option>
          <option value="10">10 rows per page</option>
          <option value="20">20 rows per page</option>
          <option value="50">50 rows per page</option>
        </select>
      </div>

      {/* Dialog Component */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-auto p-6 rounded-lg shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
              Update New Price
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              {/* Dialog Content */}
            </DialogDescription>
            <Button
              onClick={updatePrice}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Price
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Table Component */}
      <Table className="min-w-full shadow-md rounded-lg">
        <TableHeader>
        <TableHead className="px-4 py-2 text-center">S.No.</TableHead>
            <TableHead className="px-4 py-2 text-center">Name</TableHead>
            <TableHead className="px-4 py-2 text-center">Category</TableHead>
            <TableHead className="px-4 py-2 text-center">Quantity</TableHead>
            <TableHead className="px-4 py-2 text-center">
              Purchase Price
            </TableHead>
            <TableHead className="px-4 py-2 text-center">SKU</TableHead>
            <TableHead className="px-4 py-2 text-center">Action</TableHead>
        </TableHeader>
        <TableBody>
          {displayedStocks.map((stock, index) => (
            <TableRow key={stock.itemId}>
             <TableCell className="px-4 py-2 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                {stock.itemName}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                {stock.category}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                {stock.quantity}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                {stock.purchasePrice}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                {stock.sku}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">
                <i
                  className="fa-solid fa-pen-nib fa-xl cursor-pointer"
                  onClick={() => openDialog(stock)}
                ></i>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
  <Pagination>
    <PaginationContent className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      <PaginationItem>
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
        />
      </PaginationItem>

      {/* Dynamically generate page numbers */}
      {[...Array(totalPages).keys()].map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            onClick={() => handlePageChange(page + 1)}
            active={page + 1 === currentPage}
            className={`px-4 py-2 text-gray-700 rounded-md cursor-pointer ${
              page + 1 === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {page + 1}
          </PaginationLink>
        </PaginationItem>
      ))}

      <PaginationItem>
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200"
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</div>

    </div>
  );
}

export default StockList;
