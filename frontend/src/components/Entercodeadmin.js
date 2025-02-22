import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPasswordadmin from "./ResetPasswordadmin";
import styles from "./EnterCode.module.css";
import { FaUserLock } from "react-icons/fa";
import { waveform } from "ldrs"; // Import waveform library
waveform.register(); // Register the waveform component

const EnterCodeadmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Get email
  const verificationCode = location.state?.verificationCode || ""; // Get verification code

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle submit button state

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button during submission

    if (code === verificationCode) {
      setMessage("Code verified successfully!");

      // Show the waveform for 2.5 seconds before redirecting
      setTimeout(() => {
        // Redirect to the ResetPassword page and replace the current entry in the history stack
        navigate("/reset-passwordadmin", { state: { email }, replace: true });
      }, 2500); // 2.5 seconds delay
    } else {
      setMessage("Invalid code. Please try again.");
      setIsSubmitting(false); // Re-enable button on failure
    }
  };

  return (
    <div className={styles.enterCodeContainer}>
      <div className={styles.codeCont}>
        <div className={styles.iconCont}>
          <FaUserLock className={styles.icon} />
        </div>
        <h2>Verification Code</h2>
        <p className={styles.emailSent}>
          Enter the code we've sent to your email
        </p>
        <p className={styles.email}> {email}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            value={code}
            onChange={handleInputChange}
            placeholder="Enter code"
            required
          />
          <div className={styles.buttons}>
            <button
              onClick={() => navigate("/forgotpassword")}
              className={styles.backButton}
            >
              Cancel
            </button>
            <button
              className={styles.submit}
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </form>

        {/* Show waveform only if the code is successfully verified */}
        {message === "Invalid code. Please try again." && (
          <p className={styles.error}>{message}</p>
        )}
        {message === "Code verified successfully!" && (
          <div className={styles.successCont}>
            <p className={styles.success}>{message}</p>
            <l-waveform size="35" stroke="3.5" speed="1" color="#063970" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterCodeadmin;
