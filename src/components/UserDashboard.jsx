import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axiosInstance from "./AxiosInstance";
import EditCompanyDialog from "./EditCompanyDialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/AuthContext/AuthContext";
import axios from "axios";

const UserDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const userId = JSON.parse(localStorage.getItem("login")).userId;
  const navigate = useNavigate();
  const [newCompany, setNewCompany] = useState({
    companyName: "",
    companyAddress: "",
    state: "",
    pinCode: "",
    locality: "",
    district: "",
    country: "",
    mobile:"",
    gstIn: "",
    gstType: "N/A",
    user: { id: userId },
  });
  const { chnageValue, setChangeValue } = useAuth();
  useEffect(() => {
    fetchCompanies();
    localStorage.removeItem("companyId")
    setChangeValue((prev) => prev + 1);

  }, []);

  const fetchCompanies = async () => {
    const token =localStorage.getItem("login") && JSON.parse(localStorage.getItem("login")).jwtToken; // Retrieve token from localStorage
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/company/all/${userId}`)
      setCompanies(response.data);
    } catch (error) {
      setError("Failed to load companies. Please try again.");
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleGSTTypeChange = (e) => {
    setNewCompany((prev) => ({ ...prev, gstType: e.target.value }));
  };

  const handleAddCompany = async () => {
    try {
      const res = await axiosInstance.post("/company/add", newCompany);
      console.log("Company added successfully:", res.data);
      setNewCompany({
        companyName: "",
        companyAddress: "",
        state: "",
        pinCode: "",
        locality: "",
        district: "",
        country: "",
        gstIn: "",
        mobile:"",
        gstType: "N/A",
        user: { id: userId },
      });
      closeDialog();
      fetchCompanies();
    } catch (e) {
      if (e.response) {
        console.error("Error response:", e.response.data);
        setError("Unable to add company. Please check your input.");
      } else if (e.request) {
        console.error("Error request:", e.request);
        setError("No response from server. Please try again later.");
      } else {
        console.error("Error message:", e.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleCompanyRefreshAfterEdit = () => {
    fetchCompanies();
    setIsEditDialogOpen(false);
  };

  const openCompany = (id) => {
    navigate(`/company/${id}`);
    localStorage.setItem("companyId", id);
  };

  return (
    <div className="relative px-0 sm:px-20 p-2">
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openDialog} className="bg-blue-600 text-white">
              <i
                className="fa-solid fa-circle-plus fa-2xl"
                style={{ color: "FBFBFB" }}
              ></i>
              <span className="ml-2">Add Company</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg mx-auto rounded-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Add New Company
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Fill in the details below to add a new company.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 mt-4">
              <h3 className="font-semibold text-lg text-gray-600">
                Company Details
              </h3>
              {[
                "companyName",
                "mobile",
                "companyAddress",
                "state",
                "pinCode",
                "locality",
                "district",
                "country",
                "gstIn",
              ].map((field) => (
                <Input
                  key={field}
                  name={field}
                  value={newCompany[field]}
                  onChange={handleInputChange}
                  placeholder={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  className="w-full"
                />
              ))}
              <div className="mt-4">
                <h3 className="font-semibold text-lg text-gray-600">
                  Tax Information
                </h3>
                <div className="flex items-center mt-2">
                  <span className="mr-2">GST Type:</span>
                  {["Composition", "Regular", "N/A"].map((type) => (
                    <label key={type} className="ml-4">
                      <input
                        type="radio"
                        name="gstType"
                        value={type}
                        checked={newCompany.gstType === type}
                        onChange={handleGSTTypeChange}
                        className="mr-1"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  onClick={handleAddCompany}
                  className="bg-green-600 text-white"
                >
                  Add Company
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="m-10">
          <label htmlFor="search">Search Company</label>
          <Input
            className="w-96"
            placeholder="Search companies..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {loading && <p>Loading companies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && companies.length === 0 && (
        <p>No companies found.</p>
      )}

      <div className="flex justify-between flex-wrap">
        {companies
          .filter((company) =>
            company.companyName
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          )
          .map((company, index) => (
            <Card
              key={index}
              className="mb-6 shadow-lg border rounded-lg w-[32rem]"
              onClick={() => openCompany(company.companyId)}
            >
              <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                <CardTitle className="text-lg font-semibold">
                  {company.companyName}
                </CardTitle>
                <CardDescription>{company.companyAddress}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-1">
                <p>
                  <strong>State:</strong> {company.state}
                </p>
                <p>
                  <strong>Pin Code:</strong> {company.pinCode}
                </p>
                <p>
                  <strong>Locality:</strong> {company.locality}
                </p>
                <p>
                  <strong>District:</strong> {company.district}
                </p>
                <p>
                  <strong>Country:</strong> {company.country}
                </p>
                <p>
                  <strong>GST:</strong> {company.gstIn}
                </p>
              </CardContent>
              <CardFooter className="p-4 bg-gray-100 rounded-b-lg">
                <p>
                  <strong>GST Type:</strong> {company.gstType}
                </p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents the Card's onClick event
                    handleEditClick(company);
                  }}
                  className="ml-auto bg-yellow-500 text-white"
                >
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg mx-auto rounded-md">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>
              Edit the selected company's details.
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <EditCompanyDialog
              company={selectedCompany}
              onClose={handleCompanyRefreshAfterEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
