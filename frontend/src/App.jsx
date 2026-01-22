import "./App.css";
import { Contacts } from "./Components/Contact/Contacts";
// import Contact_us from "./Components/Contact_us";
import { Home } from "./Components/Home/Home";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import SetUsername from "./Components/SetUsername";
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import About_us from "./Components/About_us";
import OTP from "./Components/OTP";
import Admin_login from "./Components/Admin_login";
import Admin_pannel from "./Components/Admin_pannel";
import Profile from "./Components/Profile";
import GoogleSuccess from "./Components/GoogleSuccess";
// import Gallery from "./Components/Gallery";
import Username_login from "./Components/Username_login";
import UsernameOtp from "./Components/UsernameOtp";
import SetNewPassword from "./Components/SetNewPassword";
import GitHubSuccess from "./Components/GitHubSuccess";
import RecentUploads from "./Components/RecentUploads";
import DiscordSuccess from "./Components/DiscordSuccess";
import NotFound from "./Components/NotFound";
import Cookie from "./Components/Cookie";
import Policy from "./Components/Policy";
import Terms from "./Components/Terms";
import Gallery from "./Components/Gallery";
import Admin_History from "./Components/Admin_History";
import Data from "./Components/Data";
import Admin_Logout from "./Components/Admin_Logout";
import Success from "./Components/Success";
import Cancel from "./Components/Cancel";
import Premium_Gallery from "./Components/Premium_Gallery";
import Admin_PremiumUpload from "./Components/Admin_PremiumUpload";
import PaymentSuccess from './Components/PaymentSuccess';  // import the success page
import PaymentCancel from './Components/PaymentCancel';
import PurchaseHistory from "./Components/PurchaseHistory";
import LikedGallery from "./Components/LikedGallery";
import DataProcess from "./Components/DataProcess";
import Documentation from "./Components/Documentation";
import Patch from "./Components/Patch";
import FAQ from "./Components/FAQ";

function Layout() {
  const location = useLocation();

  const noNavFooterRoutes = ["/login", "/registration","/admin-panel",   // ✅ Fixed typo
    "/admin-login",   // ✅ Add admin login if needed
    "/admin-history",
    "/admin-data",
  "/admin-logout",
  "/puploads"];
  return (
    <>
     {!noNavFooterRoutes.includes(location.pathname) && <Navbar />}
        {/* <div className=" font-serif bg-black"> */}
          <Routes>
            {/* <Home /> */}
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contacts/>} />
            <Route path="/aboutus" element={<About_us/>} />
            <Route path="/set-username" element={<SetUsername/>} />
            <Route path="/otp" element={<OTP/>} />
            <Route path="/admin-login" element={<Admin_login />} />
            <Route path="/admin-panel" element={<Admin_pannel />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/github-success" element={<GitHubSuccess />} />
            <Route path="/discord-success" element={<DiscordSuccess />} />
            <Route path="/gallery" element={<Gallery/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/username" element={<Username_login/>} />
            <Route path="/username-otp" element={<UsernameOtp/>} />
            <Route path="/newpass" element={<SetNewPassword />} />
            <Route path="/recent-uploads" element={<RecentUploads />} />
            <Route path="*" element={<NotFound />} />
            <Route path="cookie_policy" element={<Cookie />} />
            <Route path="privacy" element={<Policy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="admin-history" element={<Admin_History />} />
            <Route path="admin-data" element={<Data />} />
            <Route path="admin-logout" element={<Admin_Logout />} />
            <Route path="success" element={<Success />} />
            <Route path="cancel" element={<Cancel />} />
            <Route path="pgallery" element={<Premium_Gallery />} />
            <Route path="puploads" element={<Admin_PremiumUpload />} />
            <Route path="/pgallery/:sharedToken" element={<Premium_Gallery />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
            <Route path="/phistory" element={<PurchaseHistory />} />
            <Route path="/liked" element={<LikedGallery />} />
            <Route path="/data-process" element={<DataProcess />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/patch" element={<Patch />} />
            <Route path="/faq" element={<FAQ />} />

          </Routes>
        {/* </div>  */}
        {!noNavFooterRoutes.includes(location.pathname) && <Footer/>}
    </>
  );
}



function App()
{
  return (
    <Router>
      <Layout/>
    </Router>
  )
}

export default App;