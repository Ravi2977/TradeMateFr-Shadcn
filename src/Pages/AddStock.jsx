import axiosInstance from "@/components/AxiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddStock = ({isInModel}) => {
  const [itemDetail, setItemDetail] = useState({
    itemName: "",
    purchasePrice: 0,
    quantity: 0,
    gstInPercent: 18,
    sku: "",
    category: "",
    company: {
      companyId: localStorage.getItem("companyId"),
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetail((prevDetail) => ({
      ...prevDetail,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/stock/add", itemDetail);
    
      setItemDetail({
        itemName: "",
        purchasePrice: 0,
        quantity: 0,
        gstInPercent: 18,
        sku: "",
        category: "",
        company: {
          companyId: localStorage.getItem("companyId"),
        },
      });
      toast.success("Item Added")
    } catch (e) {
        toast.error("Item allredy has been added")
    }
  };

  return (
    <div className={`${isInModel?"":"sm:mx-64"}`}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="itemName">Item Name</Label>
          <Input
            id="itemName"
            name="itemName"
            type="text"
            value={itemDetail.itemName}
            onChange={handleChange}
            placeholder="Enter item name"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            value={itemDetail.purchasePrice}
            onChange={handleChange}
            placeholder="Enter purchase price"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            value={itemDetail.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            type="text"
            value={itemDetail.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            type="text"
            value={itemDetail.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>

        <div className="text-center">
          <Button type="submit" className=" mt-4">
            Add Stock
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddStock;
