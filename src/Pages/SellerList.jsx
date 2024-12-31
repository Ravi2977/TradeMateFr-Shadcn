import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/AxiosInstance";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function SellerList() {
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // Default items per page

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get(
        `/seller/all/${localStorage.getItem("companyId")}`
      );
      setSellers(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));
    } catch (error) {
      toast.error("Server not responding");
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page after search
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page after changing page size
  };

  const filteredSellers = sellers.filter((seller) =>
    seller.sellerName.toLowerCase().includes(searchQuery)
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentSellers = filteredSellers.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="overflow-x-auto sm:w-full w-screen">
      {/* Search and Items Per Page */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border px-4 py-2 rounded-md w-full sm:w-auto"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="border px-4 py-2 rounded-md w-full sm:w-auto"
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Seller Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>S.No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Pin Code</TableCell>
            <TableCell>GST Type</TableCell>
            <TableCell>Mobile</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSellers.map((seller, index) => (
            <TableRow key={seller.id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{seller.sellerName}</TableCell>
              <TableCell>{seller.address}</TableCell>
              <TableCell>{seller.state}</TableCell>
              <TableCell>{seller.country}</TableCell>
              <TableCell>{seller.pinCode}</TableCell>
              <TableCell>{seller.gstType}</TableCell>
              <TableCell>{seller.mobile}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Responsive Pagination */}
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Pagination>
          <PaginationContent className="flex flex-wrap justify-center items-center gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-200"
              >
                Prev
              </PaginationPrevious>
            </PaginationItem>
            {[...Array(totalPages).keys()].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  className={`${
                    page + 1 === currentPage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  } px-3 py-1 text-sm border rounded-md hover:bg-gray-200`}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 text-sm border rounded-md hover:bg-gray-200"
              >
                Next
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default SellerList;
