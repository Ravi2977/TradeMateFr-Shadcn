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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function SellerList() {
  const [sellers, setSellers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of sellers per page

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

  // Calculate the starting and ending index for the sellers to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const currentSellers = sellers.slice(startIndex, startIndex + pageSize);

  return (
    <div className="overflow-x-auto sm:w-full w-screen">
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
          {currentSellers.slice().reverse().map((seller, index) => (
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

      <div className="mt-3">
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

export default SellerList;
