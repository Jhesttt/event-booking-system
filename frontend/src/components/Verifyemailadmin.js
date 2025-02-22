import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './VerifyEmail.module.css';

const Verifyemailadmin = () => {
  const location = useLocation(); // Access the passed email in state
  const navigate = useNavigate();

  const email = location.state?.email || 'No email passed'; // Get email from location state

  const handleContinue = async () => {
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
        navigate('/enter-codeadmin', { state: { email, verificationCode }, replace: true });
      } else {
        console.error('Failed to send verification code:', result.message);
        alert(result.message || 'Failed to send the verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert('Failed to send the verification code. Please try again.');
    }
  };


  return (
    <div className={styles.verifyEmailContainer}>
      <div className={styles.verifyCont}>
        <h2>We sent a verification code to:</h2>
        <p className={styles.email}>{email}</p>
        <div className={styles.buttonsContainer}>
          <button
            onClick={() => navigate('/entercodeadmin')}
            className={styles.backButton}
          >
            Back
          </button>
          <button className={styles.continueButton} onClick={handleContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verifyemailadmin;
