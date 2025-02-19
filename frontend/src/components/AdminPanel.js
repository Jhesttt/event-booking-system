import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./AdminPanel.module.css"; // Adjust the path if necessary
<<<<<<< HEAD
import { FaTrash } from "react-icons/fa";
=======
import { FaTrash, FaRegTimesCircle } from "react-icons/fa";
<<<<<<< HEAD
>>>>>>> e845f60 (Delete Confirmation Modals + Admin Request Validation)
=======
import { toast } from "sonner";
>>>>>>> dd16fa8 (Replaced alerts with toast in admin)

const AdminPanel = () => {
  const [reports, setReports] = useState([]);
  const [reportToDelete, setReportToDelete] = useState(null); // State to store the report ID to delete
  const deleteSingleRef = useRef(null); // Ref for the single delete confirmation modal
  // const deleteAllRef = useRef(null); // Ref for the delete all confirmation modal

  // Fetch reports for admin to review
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Handle single report deletion
  const handleDelete = async (id) => {
    setReportToDelete(id); // Store the report ID to delete
    deleteSingleRef.current.showModal(); // Show the confirmation modal
  };

  // Confirm single report deletion
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/reports/${reportToDelete}`);
      setReports(reports.filter((report) => report.id !== reportToDelete)); // Remove deleted report from the UI
      toast.success("Report deleted successfully", {
        duration: 4000, // Time before it disappears
      });
    } catch (error) {
      toast.error("Error deleting report", {
        duration: 4000, // Time before it disappears
      })
      console.error("Error deleting report:", error);
    } finally {
      deleteSingleRef.current.close(); // Close the modal
    }
  };

  // Handle delete all reports
  // const handleDeleteAll = () => {
  //   deleteAllRef.current.showModal(); // Show the "Delete All" confirmation modal
  // };

  // // Confirm delete all reports
  // const confirmDeleteAll = async () => {
  //   try {
  //     const response = await axios.delete("http://localhost:5000/api/reports/deleteall");
  //     console.log(response); // Log the response from backend
  //     setReports([]); // Clear all reports from the UI
  //     alert("All reports deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting all reports:", error);
  //   } finally {
  //     deleteAllRef.current.close(); // Close the modal
  //   }
  // };

  return (
    <div className={styles.adminPanelContainer}>
      {/* Delete All Button */}
      {/* <button className={styles.deleteAllButton} onClick={handleDeleteAll}>
        <FaTrash /> Delete All Reports
      </button> */}

      {reports.length > 0 ? (
        <ul className={styles.reportList}>
          {reports.map((report) => (
            <li key={report.id} className={styles.reportItem}>
              <div className={styles.reportHead}>
                <p>
                  <strong>Name:</strong> {report.name}
                </p>
                <p>
                  <strong>Organization:</strong> {report.org}
                </p>
                <p>
                  <strong>Message:</strong> {report.message}
                </p>
                <button onClick={() => handleDelete(report.id)}>
                  <FaTrash className={styles.trash} />
                </button>
              </div>
<<<<<<< HEAD
=======
              <p>{report.message}</p>
>>>>>>> e845f60 (Delete Confirmation Modals + Admin Request Validation)
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noReports}>No pending reports</p>
      )}

      {/* Single Delete Confirmation Modal */}
      <dialog ref={deleteSingleRef} className={styles.modal}>
        <div className={styles.modalBox}>
          <FaRegTimesCircle className={`${styles.modalIcon} ${styles.deleteIcon}`} />
          <p>Are you sure you want to delete this report?</p>
          <div className={`${styles.modalButtons} ${styles.deleteBtn}`}>
            <button onClick={() => deleteSingleRef.current.close()}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      </dialog>

      {/* Delete All Confirmation Modal */}
      {/* <dialog ref={deleteAllRef} className={styles.modal}>
        <div className={styles.modalBox}>
          <FaRegTimesCircle className={`${styles.modalIcon} ${styles.deleteIcon}`} />
          <p>Are you sure you want to delete ALL reports?</p>
          <div className={`${styles.modalButtons} ${styles.deleteBtn}`}>
            <button onClick={() => deleteAllRef.current.close()}>Cancel</button>
            <button onClick={confirmDeleteAll}>Delete All</button>
          </div>
        </div>
      </dialog> */}
    </div>
  );
};

export default AdminPanel;