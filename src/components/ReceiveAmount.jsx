import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from "@/components/AxiosInstance";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from './ui/input';
import { Button } from './ui/button';


function ReceiveAmount({ saleId, customerName, totalPaid, remainingAmount, onSuccess, closeDialog }) {
  const [amount, setAmount] = useState('');

  const handleInputChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    if (parseFloat(amount) > remainingAmount) {
      toast.error("Amount exceeds remaining balance.");
      return;
    }
      try {
        await axiosInstance.put(`/sales/editsale`, {
            id:saleId,
            receivedAmmount:amount
         });
        toast.success("Payment received successfully!");
        if (onSuccess) {
          onSuccess();
        }
        closeDialog(); // Close dialog on success
      } catch (error) {
        console.error("Error receiving amount:", error);
        toast.error("Failed to process the payment.");
      }
    
  };

  return (
    <div className="flex justify-center items-center">
    
    </div>
  );
}

export default ReceiveAmount;
