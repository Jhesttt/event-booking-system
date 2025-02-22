import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import back from "../assets/close-outline.svg";

const ResetPasswordadmin = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Get email passed from EnterCode page
  const navigate = useNavigate(); // For navigation to Login page

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkPattern, setcheckPattern] = useState("");
  const [checkMatch, setCheckMatch] = useState("");
  const [success, setSuccess] = useState("");
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false); // To track password update status
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Updated password pattern to include special characters
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_-])[A-Za-z\d!@#$%^&*-_]{8,}$/;

    // Check if the password meets the criteria
    if (!passwordPattern.test(password)) {
      setCheckMatch("");
      setcheckPattern(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    if (password === confirmPassword) {
      // Send the new password to the backend
      try {
        const response = await fetch(
          "https://event-booking-system-ckik.onrender.com/api/reset-passwordadmin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword: password }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setSuccess("Password successfully updated!");
          setIsPasswordUpdated(true); // Set flag to indicate successful update
          navigate("/adminlogin", { replace: true });
        } else {
          alert(
            result.message || "Failed to reset password. Please try again."
          );
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        alert("Failed to reset password. Please try again.");
      }
    } else {
      setcheckPattern("");
      setCheckMatch("Passwords do not match. Please try again.");
    }
  };

  return (
    <div className={styles.mainCont}>
      <div className={styles.resetPasswordContainer}>
        <h2 className={styles.title}>
          {isPasswordUpdated ? "" : "Create New Password"}
        </h2>
        {/* Conditional heading */}
        {!isPasswordUpdated ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.passCont}>
              <input
                type={showPassword2 ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="New password"
                required
              />
              <button
                type="button"
                className={styles.eyeButton1}
                onClick={() => setShowPassword2(!showPassword2)}
                aria-label={showPassword2 ? "Hide password" : "Show password"}
              >
                {showPassword2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {checkPattern && !isPasswordUpdated && (
              <p className={styles.pattern}>{checkPattern}</p>
            )}
            <div className={styles.passCont}>
              <input
                type={showPassword1 ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                className={styles.eyeButton2}
                onClick={() => setShowPassword1(!showPassword1)}
                aria-label={showPassword1 ? "Hide password" : "Show password"}
              >
                {showPassword1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {checkMatch && !isPasswordUpdated && (
              <p className={styles.match}>{checkMatch}</p>
            )}
            <div className={styles.btnCont}>
              <button
                onClick={() => navigate("/login")}
                className={styles.cancelbutton}
              >
                Cancel
              </button>
              <button type="submit" className={styles.button}>
                Confirm
              </button>
            </div>
          </form>
        ) : (<></>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordadmin;
