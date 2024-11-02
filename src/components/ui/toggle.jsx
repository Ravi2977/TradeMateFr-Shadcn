// src/components/ui/toggle.jsx
import { useState } from "react";

export const Toggle = ({ checked, onCheckedChange }) => {
  return (
    <button
      onClick={onCheckedChange}
      className={`flex items-center justify-center w-10 h-5 rounded-full ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full transition-transform transform ${
          checked ? "translate-x-5 bg-white" : "bg-white"
        }`}
      />
    </button>
  );
};
