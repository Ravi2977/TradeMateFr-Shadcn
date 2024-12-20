import React, { useState } from "react";
import axios from "axios";
import favicon from "../assets/Images/favicon.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/AuthContext/AuthContext";
import axiosInstance from "./AxiosInstance";

function Payment() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [months, setMonths] = useState(1);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const { isPaymentOpen, setIsPaymentOppen } = useAuth();
  const {paymentTracking,setPaymentTracking}=useAuth()


  const plans = {
    basic: {
      price: 299,
      features: ["Basic Support", "Limited Tools", "Single User"],
    },
    medium: {
      price: 399,
      features: ["Priority Support", "Most Tools", "Up to 3 Users"],
    },
    pro: {
      price: 599,
      features: ["24/7 Support", "All Tools", "Unlimited Users", "Analytics"],
    },
  };

  const offers = [
    "10% off on annual subscription!",
    "Free first month with coupon 'FREEMONTH'",
  ];

  const totalAmount = selectedPlan ? plans[selectedPlan].price * months : 0;
  const netPayableAmount = totalAmount - discount;

  const applyCoupon = () => {
    if (months >= 12) {
      if (coupon === "FREEMONTH") {
        setDiscount(totalAmount / months); // Discount is one month's price
      } else if (coupon === "10OFF") {
        setDiscount(totalAmount * 0.1); // 10% discount
      } else {
        alert("Invalid coupon");
        setDiscount(0); // Reset discount if coupon is invalid
      }
    } else {
      alert("Offers are only applicable on a minimum 1-year plan.");
      setDiscount(0);
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    setIsPaymentOppen(false);
    axios
      .post(`http://localhost:8080/auth/create_order`, {
        amount: netPayableAmount,
        info: "Order_request",
        email: JSON.parse(localStorage.getItem("login")).userNAme,
        durationInMonths:months
      })
      .then((response) => {
        console.log("Payment initiated. Amount:", netPayableAmount);

        if (response.data.status === "created") {
          console.log(response.data);
          axiosInstance.post(`/auth/updateOrder`, {
            orderId: response.data.id,
            createDate: response.data.created_at,
            currency: response.data.currency,
            orderEmail: JSON.parse(localStorage.getItem("login")).userNAme,
          });
          const razorpay = new window.Razorpay({
            key: "rzp_test_BK3KSXeGUlGCaD", // Your Razorpay API key
            currency: "INR",
          });

          razorpay.once("payment.failed", function (response) {
            console.error("Payment failed:", response);
            // Display user-friendly error message or handle the failure
          });

          razorpay.once("payment.success", function (response) {
            console.log("Payment successful:", response);
            // Handle successful payment (e.g., update UI, redirect user)
          });

          let options = {
            amount: response.data.amount, // Amount in smallest currency unit (e.g., paisa)
            currency: "INR",
            order_id: response.data.id,
            name: "TradeMate",
            description: "Payment for Product/Service",
            image: favicon, // URL to your company logo
            handler: function (response) {
              console.log(response.razorpay_payment_id);
              console.log(response.razorpay_order_id);
              console.log(response.razorpay_signature);
              console.log(response);
              axiosInstance.post(`/auth/successOrder`, {
                orderId: response.razorpay_order_id,
                razorpay_payment_id:response.razorpay_payment_id,
                razorpay_signature:response.razorpay_signature,

              });
              alert("Payment succesfull !!");
              setPaymentTracking((prev)=>prev+1)
            },
            prefill: {
              name: "",
              email: "",
              contact: "",
            },
            notes: {
              address: "TradeMate-Simplifying business management",
            },
            theme: {
              color: "#3399cc",
            },
          };

          // Create a new instance of Razorpay and then call open()
          const rzpInstance = new window.Razorpay(options);
          rzpInstance.open();
          rzpInstance.on("payment.failed", function (response) {
            axiosInstance.post(`/auth/failedPayment`, {
              orderId: response.error.metadata.order_id,
              status: response.error.step,
            });
            alert("Payment failed try again");
          });
        } else {
          console.error("Failed to create payment order:", response.data);
          // Display user-friendly error message or handle the failure
        }
      })
      .catch((error) => {
        console.error("Error occurred while creating payment order:", error);
        // Display user-friendly error message or handle the failure
      });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mt-4 gap-4">
        {Object.entries(plans).map(([key, plan]) => (
          <Card
            key={key}
            className={`w-80 border ${
              selectedPlan === key ? "border-black" : "border-gray-200"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-black">
                {key.charAt(0).toUpperCase() + key.slice(1)} Plan
              </CardTitle>
              <CardDescription className="text-gray-600">
                ₹{plan.price.toFixed(2)} / month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 text-gray-800">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <button
                className={`w-full px-4 py-2 rounded ${
                  selectedPlan === key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
                onClick={() => setSelectedPlan(key)}
              >
                {selectedPlan === key
                  ? "Selected"
                  : `Choose ${key.charAt(0).toUpperCase() + key.slice(1)}`}
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-bold text-black">
            Selected Plan:{" "}
            {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <label htmlFor="months" className="font-medium text-black">
              Select Months:
            </label>
            <select
              id="months"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="border border-gray-300 px-2 py-1 rounded text-black"
            >
              {[1, 3, 6, 12].map((m) => (
                <option key={m} value={m}>
                  {m} Month{m > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="coupon" className="font-medium text-black">
              Apply Coupon:
            </label>
            <input
              type="text"
              id="coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="border border-gray-300 px-2 py-1 ml-2 rounded text-black"
              placeholder="Enter coupon code"
            />
            <button
              onClick={applyCoupon}
              className="ml-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Apply
            </button>
          </div>

          <div className="mt-4">
            <p className="text-gray-800">
              Total Amount: ₹{totalAmount.toFixed(2)}
            </p>
            <p className="text-gray-800">Discount: ₹{discount.toFixed(2)}</p>
            <p className="font-bold text-black">
              Net Payable Amount: ₹{netPayableAmount.toFixed(2)}
            </p>
          </div>

          <button
            onClick={handleOnSubmit}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Proceed to Pay
          </button>
        </div>
      )}

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-bold text-black">Offers</h2>
        <ul className="list-disc pl-4 mt-2 text-gray-800">
          {offers.map((offer, index) => (
            <li key={index}>{offer}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Payment;
