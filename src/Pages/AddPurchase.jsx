import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/components/AxiosInstance";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";

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
    sellerName: ""
  });

  const [items, setItems] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);
  const [searchSeller, setSearchSeller] = useState("");
  const [searchItem, setSearchItem] = useState("");
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

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
      sellerName: name
    }));
    setSearchSeller(name);
    setShowSellerDropdown(false);
  };

  const selectItem = (itemId, name) => {
    setPurchaseDetail((prev) => ({
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
      await axiosInstance.post("/purchase/add", purchaseDetail);
      toast.success("Purchase Added");
      setPurchaseDetail({
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
        seller: { id: 0 },
        item: { itemId: 0 },
        itemName: "",
        sellerName: ""
      });
      setSearchSeller("");
      setSearchItem("");
    } catch (e) {
      toast.error("Some error occurred, try again!");
    }
  };

  return (
    <div className="md:mx-64">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h1 className="text-center text-3xl font-bold">Add New Purchase</h1>
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        <div>
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
          <Button type="submit">Add Purchase</Button>
        </div>
      </form>
    </div>
  );
}

export default AddPurchase;
