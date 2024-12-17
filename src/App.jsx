import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
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

function App() {
  const isAuthenticated = localStorage.getItem("login");

  return (
    <Router>
      
      {isAuthenticated ? (
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-grow p-2">
            <TopNavBar/>
            <Routes>
              {/* <Route path="/" element={localStorage.getItem("login")?<UserDashboard />:<Signin/>} /> */}
              <Route path="/dashboard" element={<UserDashboard />}></Route>
              <Route path="/addsale" element={<AddSale/>}/>
              <Route path="/addcustomer" element={<AddCustomer/>}/>
              <Route path="/addstock" element={<AddStock />} />
              <Route path="/sales" element={<SaleList />} />
              <Route path="/remaining" element={<ReamingSale />} />
              <Route path="/company/:id" element={<CompanyDashboard />} />
              <Route path="/customers" element={<CustomersList />} />
              <Route path="/stocks" element={<StockLIst/>} />
              <Route path="/addseller" element={<AddSeller/>} />
              <Route path="/sellers" element={<SellerList/>} />
              <Route path="/addpurchase" element={<AddPurchase/>} />
              <Route path="/purchases" element={<PurchaseList/>} />



            </Routes>
          </main>
        </SidebarProvider>
      ) : (
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
      
        </Routes>
      )}
      <ToastContainer/>
    </Router>
  );
}

export default App;
