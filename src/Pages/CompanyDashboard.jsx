import { useAuth } from "@/AuthContext/AuthContext";
import React, { useEffect } from "react";

function CompanyDashboard() {
  const { chnageValue, setChangeValue } = useAuth();
  useEffect(() => {
    setChangeValue((prev) => prev + 1);
  }, []);
  return <div>Dashboard</div>;
}

export default CompanyDashboard;
