import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Forgotpassword.module.css"; // Import your CSS module
import back from "../assets/close-outline.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (email) {
      try {
        // Make the API call to check if email exists
        const response = await axios.post("https://event-booking-system-ckik.onrender.com/api/check-email", {
          email,
        });

        if (response.status === 200) {
          try {
            const response = await fetch('https://event-booking-system-ckik.onrender.com/api/send-verification-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
              const verificationCode = result.verificationCode; // Extract the code from the response
              console.log('Verification code received from backend:', verificationCode); // Debug log

              // Navigate to EnterCode with email and code, and replace the current history entry
              navigate('/enter-code', { state: { email, verificationCode }, replace: true });
            } else {
              console.error('Failed to send verification code:', result.message);
              alert(result.message || 'Failed to send the verification code. Please try again.');
            }
          } catch (error) {
            console.error('Error sending verification code:', error);
            alert('Failed to send the verification code. Please try again.');
          }
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("Email not found.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } else {
      setError("Please enter your email.");
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.formCont}>
        <div className={styles.head}>
          <h2>Forgot Password</h2>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        {/* Display error if any */}
        <div className={styles.btnCont}>
          <button onClick={() => navigate("/login")} className={styles.cancelbutton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.button}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
