import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRouting from "./components/ProtectedRouting";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn"; // Import the new redirect component
import Login from "./components/Login";
import Signup from "./components/Signup";
import PublicPage from "./components/PublicPage";
import Dashboard from "./components/Dashboard";
import AdminLogin from "./components/AdminLogin";
import Admin from "./components/Admin";
import ForgotPassword from "./components/ForgotPassword";
import ForgotPasswordadmin from "./components/ForgotPasswordadmin";
import VerifyEmail from "./components/VerifyEmail";
import Verifyemailadmin from "./components/Verifyemailadmin";
import EnterCode from "./components/EnterCode";
import EnterCodeadmin from "./components/Entercodeadmin";
import ResetPassword from "./components/ResetPassword";
import ResetPasswordadmin from "./components/ResetPasswordadmin";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";

const App = () => {
    useEffect(() => {
        document.title = "URSAC Event Booking System";
    }, []);

    toast.options = {
        style: { padding: "1rem" }
    };

    return (
        <>
            <Toaster position="top-center" />
            <Router>
                <Routes>
                    {/* Public Routes - Restricted for Logged-in Users */}
                    <Route path="/" element={<RedirectIfLoggedIn element={<PublicPage />} />} />
                    <Route path="/login" element={<RedirectIfLoggedIn element={<Login />} />} />
                    <Route path="/signup" element={<RedirectIfLoggedIn element={<Signup />} />} />
                    <Route path="/forgotpassword" element={<RedirectIfLoggedIn element={<ForgotPassword />} />} />
                    <Route path="/forgotpasswordadmin" element={<RedirectIfLoggedIn element={<ForgotPasswordadmin />} />} />
                    <Route path="/verify-email" element={<RedirectIfLoggedIn element={<VerifyEmail />} />} />
                    <Route path="/verifyemailadmin" element={<RedirectIfLoggedIn element={<Verifyemailadmin />} />} />
                    <Route path="/enter-code" element={<RedirectIfLoggedIn element={<EnterCode />} />} />
                    <Route path="/enter-codeadmin" element={<RedirectIfLoggedIn element={<EnterCodeadmin />} />} />
                    <Route path="/reset-password" element={<RedirectIfLoggedIn element={<ResetPassword />} />} />
                    <Route path="/reset-passwordadmin" element={<RedirectIfLoggedIn element={<ResetPasswordadmin />} />} />

                    {/* Admin Routes - Protected */}
                    <Route path="/adminlogin" element={<RedirectIfLoggedIn element={<AdminLogin />} />} />
                    <Route path="/admin" element={<ProtectedRouting element={<Admin />} userType="admin" />} />

                    {/* User Dashboard - Protected */}
                    <Route path="/dashboard" element={<ProtectedRouting element={<Dashboard />} userType="user" />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
