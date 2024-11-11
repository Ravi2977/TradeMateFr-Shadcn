import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/AxiosInstance";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";

function AddSale() {
  const [saleDetail, setSaleDetail] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    rate: "",
    receivedAmmount: "",
    gstIn: "",
    company: {
      companyId: localStorage.getItem("companyId"),
    },
    customer: {
      id: 0,
    },
    item: {
      itemId: 0,
    },
    itemName: "",
    customerName: ""
  });

  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleDetail((prev) => ({ ...prev, [name]: value }));
  };

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get(
        `/customer/allCustomersByCompany/${localStorage.getItem("companyId")}`
      );
      setCustomers(response.data);
    } catch (error) {
      setError("Error fetching customers");
      console.error("Error fetching customers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        `/stock/all/${localStorage.getItem("companyId")}`
      );
      setItems(response.data);
    } catch (error) {
      setError("Error fetching products");
      console.error("Error fetching products:", error);
    }
  };

  const selectCustomer = (customerId, name) => {
    setSaleDetail((prev) => ({
      ...prev,
      customer: { id: customerId },
      customerName: name
    }));
    setSearchCustomer(name);
    setShowCustomerDropdown(false);
  };

  const selectItem = (itemId, name) => {
    setSaleDetail((prev) => ({
      ...prev,
      item: { itemId },
      itemName: name
    }));
    setSearchItem(name);
    setShowItemDropdown(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/sales/addSale", saleDetail);
      toast.success("Sale Added");
      setSaleDetail({
        date: new Date().toISOString().split("T")[0],
        quantity: "",
        rate: "",
        receivedAmmount: "",
        gstIn: "",
        company: {
          companyId: localStorage.getItem("companyId"),
        },
        customer: { id: 0 },
        item: { itemId: 0 },
        itemName: "",
        customerName: ""
      });
      setSearchCustomer("");
      setSearchItem("");
    } catch (e) {
      toast.error("Some error occurred, try again!");
    }
  };

  return (
    <div className="md:mx-64">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h1 className="text-center text-3xl font-bold">Add New Sale</h1>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <div className="relative">
            <Input
              placeholder="Search Customer"
              value={searchCustomer}
              onFocus={() => setShowCustomerDropdown(true)}
              onChange={(e) => setSearchCustomer(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {showCustomerDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
                {customers
                  .filter((customer) =>
                    customer.customerName
                      .toLowerCase()
                      .includes(searchCustomer.toLowerCase())
                  )
                  .map((customer) => (
                    <div
                      key={customer.id}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => selectCustomer(customer.id, customer.customerName)}
                    >
                      {customer.customerName}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="item">Item</Label>
          <div className="relative">
            <Input
              placeholder="Search Item"
              value={searchItem}
              onFocus={() => setShowItemDropdown(true)}
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {showItemDropdown && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
                {items
                  .filter((item) =>
                    item.itemName.toLowerCase().includes(searchItem.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.itemId}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => selectItem(item.itemId, item.itemName)}
                    >
                      {item.itemName}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="date" className="block text-gray-700 font-medium mb-2">
            Date
          </Label>
          <Input
            type="date"
            name="date"
            value={saleDetail.date}
            onChange={(e) =>
              setSaleDetail((prev) => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            type="number"
            name="quantity"
            value={saleDetail.quantity}
            onChange={handleInputChange}
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="rate">Rate</Label>
          <Input
            type="number"
            name="rate"
            value={saleDetail.rate}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="receivedAmmount">Received Amount</Label>
          <Input
            type="number"
            name="receivedAmmount"
            value={saleDetail.receivedAmmount}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="text-center">
          <Button type="submit">Add Sale</Button>
        </div>
      </form>
    </div>
  );
}

export default AddSale;
