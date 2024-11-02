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

function StockList() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10; // Adjust per page as needed

  const company = { companyId: localStorage.getItem("companyId") };

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axiosInstance.get(`/stock/all/${company.companyId}`);
      setStocks(response.data);
    } catch (err) {
      setError("Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter stocks by item name based on search term
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Stock List</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by item name..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <Table className="min-w-full bg-white shadow-md rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-center">S.No.</TableHead>
            <TableHead className="px-4 py-2 text-center">Name</TableHead>
            <TableHead className="px-4 py-2 text-center">Category</TableHead>
            <TableHead className="px-4 py-2 text-center">Quantity</TableHead>
            <TableHead className="px-4 py-2 text-center">Purchase Price</TableHead>
            <TableHead className="px-4 py-2 text-center">SKU</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedStocks.map((stock, index) => (
            <TableRow key={stock.itemId} className={stock.quantity < 5 ? "highlight" : ""}>
              <TableCell className="px-4 py-2 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell className="px-4 py-2 text-center">{stock.itemName}</TableCell>
              <TableCell className="px-4 py-2 text-center">{stock.category}</TableCell>
              <TableCell className="px-4 py-2 text-center">{stock.quantity}</TableCell>
              <TableCell className="px-4 py-2 text-center">{stock.purchasePrice}</TableCell>
              <TableCell className="px-4 py-2 text-center">{stock.sku}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
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
              <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default StockList;
