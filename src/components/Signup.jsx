import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import logo from "../assets/Images/favicon.png";
import axiosInstance from "@/components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();
  const [openVerificationDialod, setOpenVerificationDialog] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/sign-up", {
        email,
        password,
        name,
      });
      setOpenVerificationDialog(true);
    } catch (e) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-lg bg-white">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="TradeMate Logo" className="w-20 h-20" />
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Trade<span className="text-red-600">Mate</span>
          </h1>
          <h2 className="text-lg font-medium text-gray-600 mt-1">
            Sign up for TradeMate
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Name Input */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Confirm Password Input */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Signup Button */}
        <Button className="w-full mb-4" onClick={handleSignup}>
          <Mail className="mr-2 h-4 w-4" /> Sign up with Email
        </Button>

        {/* Signin Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Button
            variant="link"
            className="text-blue-600"
            onClick={() => navigate("/signin")}
          >
            Sign in
          </Button>
        </p>
      </div>
      <AlertDialog open={openVerificationDialod}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Please Verify your Account Before Login
            </AlertDialogTitle>
            <AlertDialogDescription>
              An Email has been sent to your this Email Account Please go to
              email and verify your account by using verification link Thankk
              you
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => navigate("/signin")}>Sign in </Button>
            <Button
              onClick={() =>
                window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")
              }
            >
              Open Gmail Inbox
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Signup;
