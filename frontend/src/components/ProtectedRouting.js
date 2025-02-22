import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, userType }) => {
    const isAuthenticated = userType === "admin"
        ? !!localStorage.getItem("adminUsername") // Check admin login
        : !!localStorage.getItem("userId"); // Check user login

    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
