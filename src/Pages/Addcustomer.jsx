import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axiosInstance from "@/components/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/ui/Loader";

function AddCustomer() {
  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    gstIn: "",
    gstType: "N/A",
    mobile: "",
    email: "", // Added email field
    company: {
      companyId: localStorage.getItem("companyId"),
    },
  });

  const [isLoading, setIsLoading] = useState(false); // Loader state

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await axiosInstance.post(`/customer/add`, customerDetails);
      if (response.status === 201) {
        toast.success("Customer Added");
        setCustomerDetails({
          customerName: "",
          address: "",
          state: "",
          country: "",
          pinCode: "",
          gstIn: "",
          gstType: "N/A",
          mobile: "",
          email: "",
          company: {
            companyId: localStorage.getItem("companyId"),
          },
        });
      } else {
        toast.error("Either EMail or Mobile number already Present");
      }
    } catch (error) {
      toast.error("Either EMail or Mobile number already Present");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleGSTTypeChange = (e) => {
    setCustomerDetails((prev) => ({ ...prev, gstType: e.target.value }));
  };

  return (
    <div className="sm:mx-64">
      <h1 className="text-center text-3xl font-bold">Add New Customer</h1>

      <form className="space-y-6" onSubmit={handleOnSubmit}>
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            name="customerName"
            value={customerDetails.customerName}
            onChange={handleInputChange}
            placeholder="Enter customer name"
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            name="address"
            value={customerDetails.address}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            name="state"
            value={customerDetails.state}
            onChange={handleInputChange}
            placeholder="Enter state"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            name="country"
            value={customerDetails.country}
            onChange={handleInputChange}
            placeholder="Enter country"
          />
        </div>

        <div>
          <Label htmlFor="pinCode">Pin Code</Label>
          <Input
            name="pinCode"
            type="number"
            value={customerDetails.pinCode}
            onChange={handleInputChange}
            placeholder="Enter pin code"
          />
        </div>

        <div>
          <Label htmlFor="gstType">GST Type</Label>
          <div className="flex items-center">
            {["Composition", "Regular", "N/A"].map((type) => (
              <label key={type} className="ml-4">
                <input
                  type="radio"
                  name="gstType"
                  value={type}
                  checked={customerDetails.gstType === type}
                  onChange={handleGSTTypeChange}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {customerDetails.gstType !== "N/A" && (
          <div>
            <Label htmlFor="gstIn">GSTIN</Label>
            <Input
              name="gstIn"
              value={customerDetails.gstIn}
              onChange={handleInputChange}
              placeholder="Enter GSTIN"
            />
          </div>
        )}

        <div>
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            name="mobile"
            type="tel"
            value={customerDetails.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            value={customerDetails.email}
            onChange={handleInputChange}
            placeholder="Enter email address"
          />
        </div>

        <div className="text-center">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader className="mr-2" /> : "Add Customer"}
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AddCustomer;
