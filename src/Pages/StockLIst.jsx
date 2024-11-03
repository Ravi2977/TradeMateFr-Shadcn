import axiosInstance from "@/components/AxiosInstance";
import React, { useEffect, useState } from "react";
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
  const itemsPerPage = 10;
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
        itemName:productName
      });
      setIsDialogOpen(false);
      toast.success("New Price Updated");
      fetchStocks(); // Refresh the stock list
    } catch (error) {
      toast.error("Some Error Occures ");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Stock List</h2>

      <input
        type="text"
        placeholder="Search by item name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
              Update New Price
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              <div className="flex flex-col gap-2 text-gray-700">
                <div className="text-lg font-medium">
                  <span>Item Name:</span>{" "}
                  <span className="text-gray-600">{productName}</span>
                </div>
                <div className="text-lg font-medium">
                  <span>Previous Price:</span>{" "}
                  <span className="text-gray-600">Rs. {productPrice}</span>
                </div>
              </div>
              <Label className="block text-gray-700 font-semibold mt-4">
                Enter New Name if chnaged
              </Label>
              <Input
                value={productName}
                onChange={(e) => setProdcutName(e.target.value)}
                type="text"
                placeholder="New Price"
                className="mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Label className="block text-gray-700 font-semibold mt-4">
                Enter New Price
              </Label>
              <Input
                value={productNewPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                type="number"
                placeholder="New Price"
                className="mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

      <Table className="min-w-full bg-white shadow-md rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-center">S.No.</TableHead>
            <TableHead className="px-4 py-2 text-center">Name</TableHead>
            <TableHead className="px-4 py-2 text-center">Category</TableHead>
            <TableHead className="px-4 py-2 text-center">Quantity</TableHead>
            <TableHead className="px-4 py-2 text-center">
              Purchase Price
            </TableHead>
            <TableHead className="px-4 py-2 text-center">SKU</TableHead>
            <TableHead className="px-4 py-2 text-center">Action</TableHead>
          </TableRow>
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

export default StockList;
