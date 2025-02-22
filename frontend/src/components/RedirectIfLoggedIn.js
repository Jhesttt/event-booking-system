import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ element }) => {
    const isAdminLoggedIn = !!localStorage.getItem("adminUsername"); // Check if admin is logged in
    const isUserLoggedIn = !!localStorage.getItem("userId"); // Check if user is logged in

    if (isAdminLoggedIn) {
        return <Navigate to="/admin" />; // Redirect to admin dashboard
    }
    if (isUserLoggedIn) {
        return <Navigate to="/dashboard" />; // Redirect to user dashboard
    }

    return element; // Show the public page if not logged in
};

export default RedirectIfLoggedIn;
