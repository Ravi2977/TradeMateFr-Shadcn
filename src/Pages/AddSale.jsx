import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/AxiosInstance";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    customerName: "",
  });

  const [saleDetailsList, setSaleDetailsList] = useState([]);
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({
    id: 0,
    customerName: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isItemFromOpen, setIsItemFormOpen] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const handleSelectCustomer = (id, name) => {
    setSelectedCustomer({
      id: id,
      customerName: name,
    });
    setIsDialogOpen(true);
  };

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

  const handleAddItem = () => {
    console.log(saleDetail.itemName);
    if (!saleDetail.itemName) {
      toast.info("Please Select An Items");
    } else if (saleDetail.rate === 0) {
      toast.info("PLease Add rate");
    } else if (saleDetail.quantity === 0) {
      toast.info("PLease Add quantity");
    } else {
      setSaleDetailsList((prev) => [
        ...prev,
        {
          customer: {
            id: selectedCustomer.id,
          },
          item: {
            itemId: saleDetail.item.itemId,
          },
          itemName: saleDetail.itemName,
          date: saleDetail.date,
          quantity: saleDetail.quantity,
          rate: saleDetail.rate,
          receivedAmmount: saleDetail.receivedAmmount,
          gstIn: "",
          company: {
            companyId: localStorage.getItem("companyId"),
          },
        },
      ]);
      setSaleDetail((prev) => ({
        ...prev,
        item: {
          itemId: 0,
        },
        itemName: "",
        quantity: 0,
        rate: 0,
        receivedAmmount: 0,
      }));
      setSearchItem("");
      setIsItemFormOpen(false);
    }
  };

  const removeSaleItem = (index) => {
    setSaleDetailsList((prev) => prev.filter((_, i) => i !== index));
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

  const selectItem = (itemId, name) => {
    setSaleDetail((prev) => ({
      ...prev,
      item: { itemId },
      itemName: name,
    }));
    setSearchItem(name);
    setShowItemDropdown(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/sales/addMultipleSale", saleDetailsList);
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
        customerName: "",
      });
      setSaleDetailsList([]);
      setSearchCustomer("");
      setSearchItem("");
      setIsDialogOpen(false);
    } catch (e) {
      toast.error("Some error occurred, try again!");
    }
  };
  useEffect(() => {
    let totalAmount = 0;
    let totalQuantity = 0;

    for (let i = 0; i < saleDetailsList.length; i++) {
      totalAmount += Number(saleDetailsList[i].receivedAmmount); // Convert to number
      totalQuantity += Number(saleDetailsList[i].quantity); // Convert to number
    }

    setTotalAmount(totalAmount);
    setTotalQuantity(totalQuantity);
  }, [saleDetailsList]);

  return (
    <div className="p-3">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h1 className="text-center text-3xl font-bold mb-3">Add New Sale</h1>
      <Input
        className="w-96"
        placeholder="Search Customer By Name"
        value={searchCustomer}
        onChange={(e) => setSearchCustomer(e.target.value)}
      />
      <div className="flex justify-start flex-wrap">
        {customers
          .filter((customer) =>
            customer.customerName
              .toLowerCase()
              .includes(searchCustomer.toLowerCase())
          )
          .map((customer) => (
            <Card className="w-[250px] m-3">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between">
                    {customer.customerName}
                    {selectedCustomer.id === customer.id && <div>✅</div>}
                  </div>
                </CardTitle>
                <CardDescription>{customer.mobile}</CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between">
                <div className="text-right  w-full">
                  <Button
                    onClick={() =>
                      handleSelectCustomer(customer.id, customer.customerName)
                    }
                  >
                    Select Cutomer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* <div className="text-center">
        <Button type="submit">Add Sale</Button>
      </div> */}
      {/* </form> */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="text-right mr-5">
                {selectedCustomer.customerName}
              </div>
              {isItemFromOpen ? "Add Sale Item with price" : "Added Items"}
            </DialogTitle>
            <DialogDescription>
              {isItemFromOpen && (
                <div>
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
                              item.itemName
                                .toLowerCase()
                                .includes(searchItem.toLowerCase())
                            )
                            .map((item) => (
                              <div
                                key={item.itemId}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                  selectItem(item.itemId, item.itemName)
                                }
                              >
                                {item.itemName}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
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
                  <div className="flex justify-around">
                    <Button
                      disabled={!saleDetailsList.length > 0}
                      onClick={() => setIsItemFormOpen(false)}
                      className="mt-3"
                    >
                      Cancle
                    </Button>
                    <Button onClick={handleAddItem} className="mt-3">
                      Add Item
                    </Button>
                  </div>{" "}
                </div>
              )}
              {!isItemFromOpen && (
                <div>
                  <Table>
                    <TableCaption>
                     
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Item Name</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-center">Rate</TableHead>
                        <TableHead className="text-center">
                          Received Amount (Rs.)
                        </TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {saleDetailsList.map((itemsDetials, index) => (
                        <TableRow>
                          <TableCell className="text-center">
                            {itemsDetials.itemName}
                          </TableCell>
                          <TableCell className="text-center">
                            {itemsDetials.quantity}
                          </TableCell>
                          <TableCell className="text-center">
                            {itemsDetials.rate}
                          </TableCell>
                          <TableCell className="text-center">
                            {itemsDetials.receivedAmmount}
                          </TableCell>
                          <TableCell className="text-center">
                            <i
                              class="fa-solid fa-trash fa-xl"
                              onClick={() => removeSaleItem(index)}
                              style={{ color: "#ff1100" }}
                            ></i>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div>
                  <div>Total Quantity:- Rs.{totalQuantity}</div>
                    <div>Total Received:- Rs.{totalAmount}</div>
                  </div>
                  <div className="text-right mt-2">
                    <Button onClick={() => setIsItemFormOpen(true)}>
                      {saleDetailsList.length > 0 ? "Add more" : "Add Item"}
                    </Button>
                    <Button
                      disabled={saleDetailsList.length < 1}
                      onClick={handleFormSubmit}
                      className="ml-3"
                    >
                      Add Sale
                    </Button>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddSale;
