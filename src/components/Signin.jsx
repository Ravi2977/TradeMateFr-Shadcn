import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail, Terminal } from "lucide-react";
import logo from "../assets/Images/favicon.png";
import axiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("login", JSON.stringify(response.data));
    navigate("/dashboard");
    window.location.reload();
  };

  return (
    <div className="px-96 py-10">
      <div className="flex justify-center items-center flex-col border p-10 rounded-lg gap-6 bg-gray-50">
        {/* Company Logo and Name */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="TradeMate Logo" className="w-20 h-20" />
          <h1 className="text-2xl font-semibold mt-2">
            Trade<span className="text-red-600">Mate</span>
          </h1>
        </div>

        <h2 className="text-2xl font-semibold">Signin to TradeMate</h2>

        <div>
          <label htmlFor="Email">Email</label>
          <Input
            className="w-96"
            type="email"
            value={email}
            placehoolder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="Password">Password</label>
          <Input
            className="w-96"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-right">
            <Button variant="link" onClick={() => navigate("/signup")}>
              Signup
            </Button>
          </div>
        </div>

        <Button onClick={handleSignIn}>
          <Mail /> Login with Email
        </Button>
      </div>
   
    </div>
  );
}

export default Signin;
