import axiosInstance from "@/components/AxiosInstance";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Number of customers per page

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get(
        `/customer/allCustomersByCompany/${localStorage.getItem("companyId")}`
      );
      setCustomers(response.data);
      setTotalPages(Math.ceil(response.data.length / pageSize));
    } catch (e) {
      toast.error("Server not responding");
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate the starting and ending index for the customers to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const currentCustomers = customers.slice(startIndex, startIndex + pageSize);

  return (
    <div className="sm:w-full w-screen">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>S.No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Pin Code</TableCell>
            <TableCell>GST Type</TableCell>
            <TableCell>Mobile</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCustomers.slice().reverse().map((customer, index) => (
            <TableRow key={customer.id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{customer.customerName}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.state}</TableCell>
              <TableCell>{customer.country}</TableCell>
              <TableCell>{customer.pinCode}</TableCell>
              <TableCell>{customer.gstType}</TableCell>
              <TableCell>{customer.mobile}</TableCell>
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

export default CustomersList;
