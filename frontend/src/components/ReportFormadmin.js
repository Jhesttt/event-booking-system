import React, { useState } from "react";
import axios from "axios";
import styles from "./Addcouncils.module.css"; // Adjust the path if necessary

const ReportForm = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = 1; // Static user ID, replace with actual logic for logged-in user

    try {
      await axios.post("https://event-booking-system-ckik.onrender.com/api/submitReportadmin", { userId, message });
      alert("Report submitted successfully");
      setMessage(""); // Reset the message field after submission
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report");
    }
  };

  return (
    <div className={styles.reportFormContainer}>
      <h2>Submit a Report</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your report message"
          required
        />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportForm;
