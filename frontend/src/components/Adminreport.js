// Admin.js (for Admin)
import React, { useState, useEffect } from "react";
import axios from "axios";

const Admin = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("https://event-booking-system-ckik.onrender.com/api/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Reports</h3>
      {reports.length > 0 ? (
        reports.map((report) => (
          <div key={report.id} style={{ marginBottom: "20px" }}>
            <h4>{report.title}</h4>
            <p>{report.details}</p>
            <p>Status: {report.status}</p>
            <small>Submitted by User ID: {report.sender_id}</small>
          </div>
        ))
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default Admin;
