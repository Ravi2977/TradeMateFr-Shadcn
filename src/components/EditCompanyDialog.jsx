import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "./AxiosInstance";

const EditCompanyDialog = ({ company, onClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updatedCompany, setUpdatedCompany] = useState({ ...company });

  useEffect(() => {
    setUpdatedCompany({ ...company }); // Reset form data on open
  }, [company]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleGSTTypeChange = (e) => {
    setUpdatedCompany((prev) => ({ ...prev, gstType: e.target.value }));
  };

  const handleUpdateCompany = async () => {
    try {
      const res = await axiosInstance.put(`/company/update`, updatedCompany);
      onClose(); // Trigger callback to refresh data in parent component
      closeDialog();
    } catch (e) {
      console.error("Failed to update company:", e);
      alert("Failed to update company. Please try again.");
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
  
        <form className="space-y-4">
          {["companyName", "companyAddress", "state", "pinCode", "locality", "district", "country", "gstIn"].map((field) => (
            <Input
              key={field}
              name={field}
              value={updatedCompany[field]}
              onChange={handleInputChange}
              placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            />
          ))}
          <div className="flex items-center">
            <span className="mr-2">GST Type:</span>
            {["Composition", "Regular", "N/A"].map((type) => (
              <label key={type} className="ml-4">
                <input
                  type="radio"
                  name="gstType"
                  value={type}
                  checked={updatedCompany.gstType === type}
                  onChange={handleGSTTypeChange}
                />
                {type}
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleUpdateCompany}>
              Update Company
            </Button>
          </div>
        </form>
   
  );
};

export default EditCompanyDialog;
