import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/components/AxiosInstance";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";

function AddSale() {
  const [saleDetail, setSaleDetail] = useState({
    date: new Date().toISOString().split("T")[0], // Set to current date in YYYY-MM-DD format
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
  });

  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSaleDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleGSTTypeChange = (e) => {
    const selectedGSTType = e.target.value;
    setSaleDetail((prev) => ({ ...prev, gstType: selectedGSTType }));

    if (selectedGSTType === "N/A") {
      setSaleDetail((prev) => ({ ...prev, gstIn: "" }));
    }
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
      const response = await axiosInstance.get(`/stock/all/${localStorage.getItem("companyId")}`);
      setItems(response.data);
    } catch (error) {
      setError("Error fetching products");
      console.error("Error fetching products:", error);
    }
  };
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const selectCUstomer = (e) => {
    const customerId = e.split("_")[1]; // Get the ID part after "_"
    setSaleDetail((prev) => ({
      ...prev,
      customer: {
        id: customerId,
      },
    }));
    setSelectedCustomer(e);
  };
  const selecteItem = (e) => {
    console.log(e);
    const customerId = e.split("_")[1]; // Get the ID part after "_"
    setSaleDetail((prev) => ({
      ...prev,
      item: {
        itemId: customerId,
      },
    }));
    setSelectedCustomer(e);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/sales/addSale", saleDetail);
      toast.success("Sale Added");
      setSaleDetail({
        date: new Date().toISOString().split("T")[0], // Set to current date in YYYY-MM-DD format
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
      });
      setSelectedCustomer("")
      selecteItem("")
    } catch (e) {
      toast.error("Some error occurs try again !");
    }
  };

  return (
    <div className="sm:mx-64">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h1 className="text-center text-3xl font-bold">Add New Sale</h1>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div>
          <Label htmlFor="customerName">Customer Name</Label>

          <Select onValueChange={(e) => selectCUstomer(e)}>
            <SelectTrigger className="">
              <SelectValue
                value={selectedCustomer}
                placeholder="Select Customer"
              />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer, index) => (
                <SelectItem
                  key={index}
                  value={customer.customerName + "_" + customer.id}
                >
                  {customer.customerName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="item">Item</Label>
          <Select onValueChange={(value) => selecteItem(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem
                  key={item.id}
                  value={item.itemName + "_" + item.itemId}
                >
                  {item.itemName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label
            htmlFor="date"
            className="block text-gray-700 font-medium mb-2"
          >
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
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
