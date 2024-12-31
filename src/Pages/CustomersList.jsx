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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Number of customers per page

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers when searchName or customers change
    const filtered = customers.filter((customer) =>
      customer.customerName.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setTotalPages(Math.ceil(filtered.length / pageSize));
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchName, customers, pageSize]);

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get(
        `/customer/allCustomersByCompany/${localStorage.getItem("companyId")}`
      );
      setCustomers(response.data);
      setFilteredCustomers(response.data);
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

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  // Calculate the starting and ending index for the customers to display on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="sm:w-full w-screen">
      <div className="flex justify-between items-center mb-4">
        {/* Search Input */}
        <div className="flex items-center">
          <input
            type="text"
            id="searchName"
            value={searchName}
            onChange={handleSearchNameChange}
            placeholder="Enter name"
            className="border border-gray-300 rounded-md p-1"
          />
        </div>

        {/* Items Per Page Selector */}
        <div>
          <label htmlFor="pageSize" className="mr-2 sm:flex hidden">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md p-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

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
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCustomers
            .slice()
            .reverse()
            .map((customer, index) => (
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
                <TableCell>Delete</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

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
                      ? "bg-blue-500 "
                      : ""
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

export default CustomersList;
