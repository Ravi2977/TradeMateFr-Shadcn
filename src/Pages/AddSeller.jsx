import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import axiosInstance from "@/components/AxiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddSeller({isInModel}) {
  const [sellerDetails, setSellerDetails] = useState({
    sellerName: "",
    address: "",
    state: "",
    country: "",
    pinCode: "",
    gstIn: "",
    gstType: "N/A",
    mobile: "",
    company: {
      companyId: localStorage.getItem("companyId"),
    },
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/seller/add`, sellerDetails);
      if (response.status === 201) {
        toast.success("Seller Added Successfully");
        setSellerDetails({
          sellerName: "",
          address: "",
          state: "",
          country: "",
          pinCode: "",
          gstIn: "",
          gstType: "N/A",
          mobile: "",
          company: {
            companyId: localStorage.getItem("companyId"),
          },
        });
      } else {
        toast.error("Seller Already Exists");
      }
    } catch (error) {
      toast.error("Failed to Add Seller");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSellerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleGSTTypeChange = (e) => {
    setSellerDetails((prev) => ({ ...prev, gstType: e.target.value }));
  };

  return (
    <div className={`${isInModel?"":"sm:mx-64"}`}>
      <h1 className="text-center text-3xl font-bold">Add New Seller</h1>

      <form className="space-y-6" onSubmit={handleOnSubmit}>
        <div>
          <Label htmlFor="sellerName">Seller Name</Label>
          <Input
            name="sellerName"
            value={sellerDetails.sellerName}
            onChange={handleInputChange}
            placeholder="Enter seller name"
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            name="address"
            value={sellerDetails.address}
            onChange={handleInputChange}
            placeholder="Enter address"
          />
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input
            name="state"
            value={sellerDetails.state}
            onChange={handleInputChange}
            placeholder="Enter state"
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            name="country"
            value={sellerDetails.country}
            onChange={handleInputChange}
            placeholder="Enter country"
          />
        </div>

        <div>
          <Label htmlFor="pinCode">Pin Code</Label>
          <Input
            name="pinCode"
            type="number"
            value={sellerDetails.pinCode}
            onChange={handleInputChange}
            placeholder="Enter pin code"
          />
        </div>

        <div>
          <Label htmlFor="gstType">GST Type</Label>
          <div className="flex items-center space-x-4">
            {["Composition", "Regular", "N/A"].map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gstType"
                  value={type}
                  checked={sellerDetails.gstType === type}
                  onChange={handleGSTTypeChange}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Conditionally render GSTIN input based on selected GST Type */}
        {sellerDetails.gstType !== "N/A" && (
          <div>
            <Label htmlFor="gstIn">GSTIN</Label>
            <Input
              name="gstIn"
              value={sellerDetails.gstIn}
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
            value={sellerDetails.mobile}
            onChange={handleInputChange}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="text-center">
          <Button type="submit">Add Seller</Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}




export default AddSeller;
