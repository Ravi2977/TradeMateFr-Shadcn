import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import UserDashboard from "./components/UserDashboard";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import AddSale from "./Pages/AddSale";
import AddCustomer from "./Pages/Addcustomer";
import { ToastContainer } from "react-toastify";
import AddStock from "./Pages/AddStock";
import SaleList from "./Pages/SaleLIst";
import ReamingSale from "./Pages/ReamingSale";
import CompanyDashboard from "./Pages/CompanyDashboard";
import CustomersList from "./Pages/CustomersList";
import StockLIst from "./Pages/StockLIst";
import AddSeller from "./Pages/AddSeller";
import SellerList from "./Pages/SellerList";
import AddPurchase from "./Pages/AddPurchase";
import PurchaseList from "./Pages/PurchaseList";
import TopNavBar from "./components/TopNavBar";
import { ThemeProvider } from "next-themes";
import ExpenseList from "./Pages/ExpenseList";


function App() {
  const isAuthenticated = Boolean(localStorage.getItem("login"));

  const AuthenticatedRoutes = () => (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-grow p-2">
        <TopNavBar />
        <Routes>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/addsale" element={<AddSale />} />
          <Route path="/addcustomer" element={<AddCustomer />} />
          <Route path="/addstock" element={<AddStock />} />
          <Route path="/sales" element={<SaleList />} />
          <Route path="/remaining" element={<ReamingSale />} />
          <Route path="/company/:id" element={<CompanyDashboard />} />
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/stocks" element={<StockLIst />} />
          <Route path="/addseller" element={<AddSeller />} />
          <Route path="/sellers" element={<SellerList />} />
          <Route path="/addpurchase" element={<AddPurchase />} />
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/addexpense" element={<ExpenseList />} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </SidebarProvider>
  );

  const UnauthenticatedRoutes = () => (
    <Routes>
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
    <Router>
      {isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
      <ToastContainer />
    </Router>
    </ThemeProvider>
  );
}

export default App;
