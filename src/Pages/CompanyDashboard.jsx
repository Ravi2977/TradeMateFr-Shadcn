import { useAuth } from "@/AuthContext/AuthContext";
import axiosInstance from "@/components/AxiosInstance";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import { toast } from "react-toastify";
import Invoice from "@/components/Invoive";

function CompanyDashboard() {
  const { changeValue, setChangeValue } = useAuth();
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [companyNewInfo, setCompanyNewInfo] = useState({
    companyId: localStorage.getItem("companyId"),
  }); // New state for edited info
  const [base64Image, setBase64Image] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState(false); // State for toggling account number visibility
  const invoiceData = {
    invoiceNumber: "12345",
    date: "2024-11-03",
    dueDate: "2024-11-10",
    recipient: {
      name: "John Doe",
      address: "123 Main St, City, State, ZIP",
      email: "john@example.com",
    },
    items: [
      { description: "Product A", quantity: 2, unitPrice: 29.99 },
      { description: "Product B", quantity: 1, unitPrice: 49.99 },
    ],
    total: 109.97,
  };
  useEffect(() => {
    setChangeValue((prev) => prev + 1);
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await axiosInstance.get(
        `/company/getCompanyBYId/${localStorage.getItem("companyId")}`
      );
      setCompany(response.data);
      setCompanyNewInfo(response.data); // Initialize the new info state
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post(`/company/updateImage`, companyNewInfo);
      setIsEditing(false);
      fetchCompany(); // Refresh company data after editing
      toast.success("Details Saved");
    } catch (error) {
      toast.error("Some Error Occured. Try again.");
    }
    console.log(companyNewInfo);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result); // Set the base64 image
        setCompanyNewInfo((prev) => ({
          ...prev,
          image: reader.result, // Add the base64 image to the state
        }));
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  const handlePenClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  if (!company) return <div>Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <div>
        <h5 className="text-xl font-bold">{company.companyName}</h5>
      </div>
      <div className="border border-gray-300 rounded p-4 bg-white">
        <p>
          <strong>Mobile:</strong> {company.mobile || "N/A"}
        </p>

        <p>Authorization Stamp with</p>
        <img
          src={company.image}
          alt="Company Sign and Stamp"
          className="mb-4 max-w-xs h-36"
        />
        {/* Button to toggle account number visibility */}

        <p>
          <strong>Account Number:</strong>{" "}
          {showAccountNumber
            ? company.accountNumber || "N/A"
            : "****************"}
          <button
            className="ml-2"
            onClick={() => setShowAccountNumber((prev) => !prev)}
          >
            {showAccountNumber ? (
              <i class="fa-solid fa-eye-slash fa-xl"></i>
            ) : (
              <i class="fa-regular fa-eye fa-xl"></i>
            )}
          </button>
        </p>

        <p>
          <strong>Bank Name:</strong> {company.bankName || "N/A"}
        </p>
        <p>
          <strong>IFSC Code:</strong> {company.ifscCode || "N/A"}
        </p>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button onClick={handleEdit}>Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Company Details</DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <input
                  type="text"
                  className="border p-1 w-full"
                  placeholder="Account Number"
                  value={companyNewInfo.accountNumber || ""}
                  onChange={(e) =>
                    setCompanyNewInfo({
                      ...companyNewInfo,
                      accountNumber: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="border p-1 w-full"
                  placeholder="Bank Name"
                  value={companyNewInfo.bankName || ""}
                  onChange={(e) =>
                    setCompanyNewInfo({
                      ...companyNewInfo,
                      bankName: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="border p-1 w-full"
                  placeholder="IFSC Code"
                  value={companyNewInfo.ifscCode || ""}
                  onChange={(e) =>
                    setCompanyNewInfo({
                      ...companyNewInfo,
                      ifscCode: e.target.value,
                    })
                  }
                />
                <Label>Upload Image of your sign with Stamp</Label>
                <div className="relative mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="border border-gray-300 w-32 h-32 rounded-md flex items-center justify-center relative">
                    {base64Image ? (
                      <img
                        src={base64Image}
                        alt="Uploaded Preview"
                        className="object-cover w-full h-full rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400">No Image Selected</span>
                    )}
                    <PencilIcon
                      onClick={handlePenClick}
                      className="absolute bottom-2 right-2 h-6 w-6 text-gray-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={() => setIsEditing(false)} className="ml-2">
                  Cancel
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      
    </div>
  );
}

export default CompanyDashboard;
