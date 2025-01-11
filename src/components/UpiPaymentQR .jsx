import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"; // Import ShadCN Alert

export const UpiPaymentQR = ({ amount, months }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(""); // QR Code URL

  // UPI ID is hardcoded
  const upiId = "mauryaravi5991@ybl";

  // Generate UPI Payment URL
  const generateUpiUrl = () => {
    if (!upiId || !amount) return "";
    return `upi://pay?pa=${upiId}&pn=YourName&am=${amount}&cu=INR`;
  };

  useEffect(() => {
    if (amount) {
      const upiUrl = generateUpiUrl();
      try {
        // Generate QR Code as Data URL when amount is updated
        QRCode.toDataURL(upiUrl).then((url) => {
          setQrCodeUrl(url);
        });
      } catch (error) {
        console.error("Failed to generate QR Code:", error);
      }
    }
  }, [amount]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white border border-gray-200 rounded-lg shadow-sm space-y-6">
      <h2 className="text-lg font-semibold">UPI Payment QR Code</h2>

      {/* ShadCN Alert for Important Information */}
      <Alert variant="default">
        <AlertTitle className="font-semibold">Important Information</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>
            <span className="font-medium">Verify UPI ID:</span>{" "}
            <span className="font-bold text-primary-600">{upiId}</span>
          </p>
          <p>
            You have selected <span className="font-medium">{months}</span> month(s). <br />
            This will cost <span className="font-medium">₹{amount}</span>.
          </p>
          <p>
            Please mention your email address registered with your TradMate account in the
            payment remarks so we can activate your account. Thank you!
          </p>
        </AlertDescription>
      </Alert>

      {/* QR Code Section */}
      {qrCodeUrl ? (
        <div className="text-center mt-4">
          <h3 className="text-sm font-semibold">Scan to Pay</h3>
          <img src={qrCodeUrl} alt="UPI QR Code" className="mx-auto mt-2" />
        </div>
      ) : (
        <p className="text-sm text-gray-500">Waiting for amount...</p>
      )}
    </div>
  );
};

export default UpiPaymentQR;
