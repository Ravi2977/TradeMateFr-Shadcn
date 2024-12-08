import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import logo from "../assets/Images/favicon.png";
import axiosInstance from "@/components/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Swal from "sweetalert2";
import Loader from "./ui/Loader";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array for each OTP digit
  const [isOtpGenerated, setIsOtpGenerated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const handleGenerateOtp = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/generate-otp", {
        email,
        password,
      });

      if (response.data==="Otp Sent") {
        setIsOtpGenerated(true);
        setError(null);
      } else {
        setError(response.data);
      }

      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError("Failed to generate OTP. Please check your credentials.");
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
        otp: otp.join(""), // Join digits into a single string for API
      });
      if (response.data === "Otp is Incorrect") {
        Swal.fire(response.data);
      } else if (response.data === "Otp Expired") {
        Swal.fire(response.data);
      } else {
        localStorage.setItem("login", JSON.stringify(response.data));
        navigate("/dashboard");
        window.location.reload();
      }
    } catch (e) {
      setError("Failed to sign in. Please check your credentials and OTP.");
    }
  };

  // Handle each OTP input change and backspace clearing
  const handleOtpChange = (index, value, event) => {
    if (event.nativeEvent.inputType === "deleteContentBackward" && !value) {
      // Clear current box and move focus to the previous box on backspace
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = "";
        return newOtp;
      });
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    } else if (value.length <= 1) {
      // Update current box and move focus to the next box if filled
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 border rounded-lg shadow-lg bg-white">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="TradeMate Logo" className="w-20 h-20" />
          <h1 className="text-3xl font-bold text-gray-800 mt-2">
            Trade<span className="text-red-600">Mate</span>
          </h1>
          <h2 className="text-lg font-medium text-gray-600 mt-1">
            Sign in to TradeMate
          </h2>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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

        {isOtpGenerated && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter otp
            </label>
            <div className="flex space-x-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value, e)}
                  className="text-center w-10 h-10 text-lg font-semibold"
                />
              ))}
            </div>
          </div>
        )}

        {!isOtpGenerated ? (
          <Button className="w-full mb-4" onClick={handleGenerateOtp}>
            <Mail className="mr-2 h-4 w-4" />{" "}
            {isLoading ? <Loader className="mr-2" /> : "Generate OTP"}
          </Button>
        ) : (
          <Button className="w-full mb-4" onClick={handleSignIn}>
            <Mail className="mr-2 h-4 w-4" /> Login with OTP
          </Button>
        )}

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Button
            variant="link"
            className="text-blue-600"
            onClick={() => navigate("/signup")}
          >
            Signup
          </Button>
        </p>
      </div>
    </div>
  );
}

export default Signin;
