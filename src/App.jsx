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

function App() {
  const isAuthenticated = localStorage.getItem("login");

  return (
    <Router>
      
      {isAuthenticated ? (
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-grow p-2">
            <SidebarTrigger />
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
