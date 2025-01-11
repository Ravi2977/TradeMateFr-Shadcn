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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // ShadCN Alert components
import axiosInstance from "./AxiosInstance";
import Payment from "./Payment";
import { useAuth } from "@/AuthContext/AuthContext";
import { useTheme } from "next-themes"; // ShadCN theme hook
import { MoonIcon, SunIcon } from "lucide-react";

function TopNavBar() {
  const email = JSON.parse(localStorage.getItem("login"))?.userNAme;
  const { isPaymentOpen, setIsPaymentOppen } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const { paymentTracking, setPaymentTracking } = useAuth();
  const { theme, setTheme } = useTheme("dark"); // ShadCN dark/light mode logic

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
  }, [email, isPaymentOpen, paymentTracking]);

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

  const toggleTheme = () => {
    if (!theme) {
      console.log("Theme is still loading");
      return;
    }

    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    console.log(`Switched to ${newTheme}`);
  };

  return (
    <div className="flex justify-between items-center p-4">
      <div className=" w-full">
        <div className="flex justify-between mb-2">
          <div>
            <SidebarTrigger />
          </div>
          <div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="flex items-center"
            >
              {theme === "dark" ? (
                <SunIcon className="w-5 h-5 text-yellow-500" /> // Icon for Light Mode
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-800" /> // Icon for Dark Mode
              )}
            </Button>
          </div>
        </div>

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
      </div>

      {/* Open the Dialog if subscription expired */}
      {isExpired && (
        <>
          {/* Full-Screen Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            {/* Prevent interaction with the background */}
            <div className="h-full w-full flex items-center justify-center pointer-events-none">
              {/* Payment section will be centered and still clickable */}
              <div className="pointer-events-auto bg-white p-8 rounded-md shadow-lg">
                <h3>Your subscription has expired!</h3>
                <p>Please renew it soon to continue enjoying the service.</p>
                <Button onClick={openPayment}>See Pricing</Button>
              </div>
            </div>
          </div>
        </>
      )}

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
