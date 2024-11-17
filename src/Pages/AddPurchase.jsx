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

function AddPurchase() {
  const [purchaseDetail, setPurchaseDetail] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    price: "",
    totalAmount: "",
    paidAmount: "",
    gstInRupee: "",
    remaining: "",
    company: {
      companyId: localStorage.getItem("companyId"),
    },
    seller: {
      id: 0,
    },
    item: {
      itemId: 0,
    },
    itemName: "",
    sellerName: "",
  });

  const [items, setItems] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [purchaseDetailsList, setPurchaseDetialsList] = useState([]);
  const [isItemFromOpen, setIsItemFormOpen] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState({
    sellerName: "",
    id: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [searchSeller, setSearchSeller] = useState("");
  const handleSelectSeller = (id, name) => {
    setSelectedSeller({
      id: id,
      sellerName: name,
    });
    setIsDialogOpen(true);
  };
  useEffect(() => {
    fetchSellers();
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPurchaseDetail((prev) => ({ ...prev, [name]: value }));
  };

  const fetchSellers = async () => {
    try {
      const response = await axiosInstance.get(
        `/seller/all/${localStorage.getItem("companyId")}`
      );
      setSellers(response.data);
    } catch (error) {
      setError("Error fetching sellers");
      console.error("Error fetching sellers:", error);
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

  const selectSeller = (sellerId, name) => {
    setPurchaseDetail((prev) => ({
      ...prev,
      seller: { id: sellerId },
      sellerName: name,
    }));
    setSearchSeller(name);
  };

  const selectItem = (itemId, name) => {
    setPurchaseDetail((prev) => ({
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
      await axiosInstance.post("/purchase/add", purchaseDetailsList);
      toast.success("Purchase Added");
      setPurchaseDetialsList([]);
      setSearchSeller("");
      setSearchItem("");
    } catch (e) {
      toast.error("Some error occurred, try again!");
    }
  };
  const handleAddItem = () => {
    if (!purchaseDetail.itemName) {
      toast.info("Please Select An Items");
    } else if (purchaseDetail.price === 0) {
      toast.info("PLease Add price");
    } else if (purchaseDetail.quantity === 0) {
      toast.info("PLease Add quantity");
    } else {
      setPurchaseDetialsList((prev) => [
        ...prev,
        {
          seller: {
            id: selectedSeller.id,
          },
          item: {
            itemId: purchaseDetail.item.itemId,
          },
          itemName: purchaseDetail.itemName,
          date: purchaseDetail.date,
          quantity: purchaseDetail.quantity,
          price: purchaseDetail.price,
          paidAmount: purchaseDetail.paidAmount,
          gstIn: "",
          company: {
            companyId: localStorage.getItem("companyId"),
          },
        },
      ]);
      setPurchaseDetail((prev) => ({
        ...prev,
        item: {
          itemId: 0,
        },
        itemName: "",
        quantity: 0,
        price: 0,
        paidAmount: 0,
      }));
      setSearchItem("");
      setIsItemFormOpen(false);
    }
  };
  const removePurchaseItem = (index) => {
    setPurchaseDetialsList((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let totalAmount = 0;
    let totalQuantity = 0;

    for (let i = 0; i < purchaseDetailsList.length; i++) {
      totalAmount += Number(purchaseDetailsList[i].paidAmount); // Convert to number
      totalQuantity += Number(purchaseDetailsList[i].quantity); // Convert to number
    }

    setTotalAmount(totalAmount);
    setTotalQuantity(totalQuantity);
  }, [purchaseDetailsList]);

  return (
    <div className="">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h1 className="text-center text-3xl font-bold">Add New Purchase</h1>
      <Input
        className="w-96"
        placeholder="Search Seller By Name"
        value={searchSeller}
        onChange={(e) => setSearchSeller(e.target.value)}
      />
      <div className="flex">
        {sellers
          .filter((seller) =>
            seller.sellerName
              .toLowerCase()
              .includes(searchSeller.toLowerCase())
          )
          .map((seller, index) => (
            <Card className="w-[250px] m-3">
              <CardHeader>
                <CardTitle>
                  <div className="flex justify-between">
                    {seller.sellerName}
                    {selectedSeller.id === seller.id && <div>✅</div>}
                  </div>
                </CardTitle>
                <CardDescription>{seller.mobile}</CardDescription>
              </CardHeader>

              <CardFooter className="flex justify-between">
                <div className="text-right  w-full">
                  <Button
                    onClick={() =>
                      handleSelectSeller(seller.id, seller.sellerName)
                    }
                  >
                    Select Seller
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="text-right mr-10">
                Seller :- {selectedSeller.sellerName}
              </div>
              {isItemFromOpen ? "Add Sale Item with price" : "Added Items"}
            </DialogTitle>
            <DialogDescription>
              {isItemFromOpen && (
                <div className="space-y-6">
                  {/* <div>
                    <Label htmlFor="sellerName">Seller Name</Label>
                    <div className="relative">
                      <Input
                        placeholder="Search Seller"
                        value={searchSeller}
                        onFocus={() => setShowSellerDropdown(true)}
                        onChange={(e) => setSearchSeller(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      {showSellerDropdown && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg z-10">
                          {sellers
                            .filter((seller) =>
                              seller.sellerName.toLowerCase().includes(searchSeller.toLowerCase())
                            )
                            .map((seller) => (
                              <div
                                key={seller.id}
                                className="p-2 cursor-pointer hover:bg-gray-100"
                                onClick={() => selectSeller(seller.id, seller.sellerName)}
                              >
                                {seller.sellerName}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div> */}

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

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      type="date"
                      name="date"
                      value={purchaseDetail.date}
                      onChange={(e) =>
                        setPurchaseDetail((prev) => ({
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
                      value={purchaseDetail.quantity}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      type="number"
                      name="price"
                      value={purchaseDetail.price}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paidAmount">Paid Amount</Label>
                    <Input
                      type="number"
                      name="paidAmount"
                      value={purchaseDetail.paidAmount}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>

                  <div className="text-center">
                    <Button onClick={handleAddItem}>Add Purchase</Button>
                  </div>
                </div>
              )}
              {!isItemFromOpen && (
                <div>
                  <Table>
                    <TableCaption></TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Item Name</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-center">Rate</TableHead>
                        <TableHead className="text-center">
                          Paid Amount (Rs.)
                        </TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseDetailsList.map((itemsDetials, index) => (
                        <TableRow>
                          <TableCell className="text-center">
                            {itemsDetials.itemName}
                          </TableCell>
                          <TableCell className="text-center">
                            {itemsDetials.quantity}
                          </TableCell>
                          <TableCell className="text-center">
                            {itemsDetials.price}
                          </TableCell>
                          <TableCell className="text-center">
                            {itemsDetials.paidAmount}
                          </TableCell>
                          <TableCell className="text-center">
                            <i
                              class="fa-solid fa-trash fa-xl"
                              onClick={() => removePurchaseItem(index)}
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
                      {purchaseDetailsList.length > 0 ? "Add more" : "Add Item"}
                    </Button>
                    <Button
                      disabled={purchaseDetailsList.length < 1}
                      onClick={handleFormSubmit}
                      className="ml-3"
                    >
                      Add Purhcase
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

export default AddPurchase;
