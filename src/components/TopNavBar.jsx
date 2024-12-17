"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card and CardHeader are ShadCN components
import { Button } from "@/components/ui/button"; // Assuming Button is a ShadCN component
import { Link } from "react-router-dom";
import { SidebarTrigger } from "./ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // ShadCN Alert components
import axiosInstance from "./AxiosInstance";
import Payment from "./Payment";
import { useAuth } from "@/AuthContext/AuthContext";

function TopNavBar() {
  const email = JSON.parse(localStorage.getItem("login"))?.userNAme;
  const {isPaymentOpen, setIsPaymentOppen} = useAuth()
  const [userData, setUserData] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility

  const fetchUser = async () => {
    const response = await axiosInstance.get(`/user/byemail/${email}`);
    setUserData(response.data);

    const expDate = new Date(response.data.expDate);
    const currentDate = new Date();
    const remainingDays = response.data.remainingDays;

    // Check if the subscription has expired
    if (expDate < currentDate) {
      setIsExpired(true);
    }

    // Check if the subscription will expire in less than 15 days
    if (remainingDays < 15) {
      setIsExpiringSoon(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [email,isPaymentOpen]);

  const handlePurchaseSubscription = () => {
    // Navigate to the subscription purchase page or handle logic here
    console.log("Redirecting to purchase subscription page");
  };

  const openPayment = () => {
    setIsPaymentOppen(true);
  };

  const closePaymen = () => {
    setIsPaymentOppen(false);
  };

  return (
    <div>
      <SidebarTrigger />

      {/* Show alert if subscription is expiring soon */}
      {isExpiringSoon && (
        <Alert variant="destructive">
          <AlertTitle>Your subscription is expiring soon!</AlertTitle>
          <AlertDescription>
            <div className="flex justify-between">
              Your subscription will expire in {userData?.remainingDays} days.
              Please renew it soon to continue enjoying the service.
              <Button onClick={openPayment}>See Pricing</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Open the AlertDialog if subscription expired */}
      <AlertDialog open={isExpired} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Subscription Expired</AlertDialogTitle>
            <AlertDialogDescription>
              Your subscription has expired. Would you like to purchase a new
              subscription to continue enjoying our service?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
            <AlertDialogAction onClick={openPayment}>
              Purchase Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOppen}>
  <DialogContent className="w-full max-w-6xl h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Pricing</DialogTitle>
      <DialogDescription>
        <Payment />
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  );
}

export default TopNavBar;
