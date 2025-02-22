import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Addcouncils.module.css"; // Adjust the path if necessary
import { toast } from "sonner";

const ReportForm = () => {
  const [message, setMessage] = useState("");
  const [org, setOrg] = useState("");
  const [organization, setOrganization] = useState('');

  useEffect(() => {
    const storedOrganization = localStorage.getItem('userOrganization');
    if (storedOrganization) {
      setOrganization(storedOrganization);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (trimmedMessage === "") {
      toast.error("Report cannot be empty or just spaces", { duration: 4000 });
      return; // Prevent submission if message is empty or just spaces
    }

    const userId = 1; // Static user ID, replace with actual logic for logged-in user

    // Log the data before sending it to the backend
    console.log("Sending data:", { userId, message, org });

    try {
      await axios.post("https://event-booking-system-ckik.onrender.com/api/submitReport", {
        userId,
        message,
        org,
      });
      toast.success("Report submitted successfully", {
        duration: 4000, // Time before it disappears
      });

      setMessage(""); // Reset the message field after submission
      setOrg(""); // Reset the organization field after submission
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report", { duration: 4000 });
    }
  };


  return (
    <form onSubmit={handleSubmit} className={styles.reportContent}>
      {/* <input
        className={styles.inputField}
        type="text"
        value={organization}
        onChange={(e) => setOrg(e.target.value)}
        placeholder="Enter your organization"
        required
      /> */}
      <textarea
        className={styles.messageInput}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        required
      />
      <button className={styles.reportButton} onClick={() => setOrg(organization)} type="submit">
        Send Message
      </button>
    </form>
  );
};

export default ReportForm;
