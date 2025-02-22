import React, { useState, useRef } from "react";
import EditCouncilModal from "./EditCouncilModal";
import Addcouncils from "./Addcouncils";
import styles from "./Admin.module.css";
import { FaSearch, FaPlus, FaPen, FaTrash, FaRegTimesCircle } from "react-icons/fa";
import { toast } from "sonner";

const CouncilsAndOrganizations = ({ councils, setCouncils, showAddCouncilForm, setShowAddCouncilForm, handleAddCouncil }) => {
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [councilToDelete, setCouncilToDelete] = useState(null); // State to store the council ID to delete
  const dialogRef = useRef(null); // Ref for the confirmation modal

  const handleDelete = async (id) => {
    setCouncilToDelete(id); // Store the council ID to delete
    dialogRef.current.showModal(); // Show the confirmation modal
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`https://event-booking-system-ckik.onrender.com/delete-council/${councilToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCouncils(councils.filter((council) => council.id !== councilToDelete));
        toast.success("Council deleted successfully", {
          duration: 4000, // Time before it disappears
        });
      } else {
        console.error("Failed to delete council");
      }
    } catch (error) {
      toast.error("Error deleting council", {
        duration: 4000, // Time before it disappears
      })
      console.error("Error deleting council:", error);
    } finally {
      dialogRef.current.close(); // Close the modal
    }
  };

  const handleEdit = (council) => {
    setSelectedCouncil(council);
    setShowEditModal(true);
  };

  const handleUpdateCouncil = async (updatedCouncilData) => {
    try {
      const response = await fetch(`https://event-booking-system-ckik.onrender.com/api/update-council/${selectedCouncil.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedCouncilData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setCouncils((prevCouncils) =>
          prevCouncils.map((council) =>
            council.id === selectedCouncil.id ? { ...council, ...updatedCouncilData } : council
          )
        );
        setShowEditModal(false);
        toast.success("Council updated successfully", {
          duration: 4000, // Time before it disappears
        });
      } else {
        toast.error("Error updating council", {
          duration: 4000, // Time before it disappears
        });
        console.error("Failed to update council");
      }
    } catch (error) {
      toast.error("Error updating council", {
        duration: 4000, // Time before it disappears
      });
      console.error("Error updating council:", error);
    }
  };

  // Filter councils based on search input
  const filteredCouncils = councils.filter((council) =>
    Object.values(council).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    ));

  return (
    <div className={styles.councilsCont}>
      <h2>Councils and Organizations</h2>
      <p>View, add, edit, search, and delete councils and organizations.</p>
      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrap}>
          <input
            type="text"
            placeholder="Search councils..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchBar}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
        <button className={styles.addCouncilButton} onClick={() => setShowAddCouncilForm(true)}>
          <FaPlus /><span>Add Council / Organization </span>
        </button>
      </div>

      <div className={styles.sectionBox}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Organization</th>
              <th className={styles.tableCell}>Adviser</th>
              <th className={styles.tableCell}>President</th>
              <th className={styles.tableCell}>Vice President</th>
              <th className={styles.tableCell}>Secretary</th>
              <th className={styles.tableCell}>Treasurer</th>
              <th className={styles.tableCell}>Auditor</th>
              <th className={styles.tableCell}>P.R.O</th>
              <th className={styles.tableCell}>1st Year Representative</th>
              <th className={styles.tableCell}>2nd Year Representative</th>
              <th className={styles.tableCell}>3rd Year Representative</th>
              <th className={styles.tableCell}>4th Year Representative</th>
              <th className={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCouncils.length > 0 ? (
              filteredCouncils.map((council) => (
                <tr key={council.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{council.organization}</td>
                  <td className={styles.tableCell}>{council.adviser}</td>
                  <td className={styles.tableCell}>{council.president}</td>
                  <td className={styles.tableCell}>{council.vicePresident}</td>
                  <td className={styles.tableCell}>{council.secretary}</td>
                  <td className={styles.tableCell}>{council.treasurer}</td>
                  <td className={styles.tableCell}>{council.auditor}</td>
                  <td className={styles.tableCell}>{council.pro}</td>
                  <td className={styles.tableCell}>{council.representative}</td>
                  <td className={styles.tableCell}>{council.rep}</td>
                  <td className={styles.tableCell}>{council.trdrepresentative}</td>
                  <td className={styles.tableCell}>{council.frthrepresentative}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actions}>
                      <button className={styles.editButton} onClick={() => handleEdit(council)}>
                        <FaPen className={styles.pen} />
                      </button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(council.id)}>
                        <FaTrash className={styles.trash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className={styles.noEvents}>No council available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <dialog ref={dialogRef} className={styles.modal}>
        <div className={styles.modalBox}>
          <FaRegTimesCircle className={`${styles.modalIcon} ${styles.deleteIcon}`} />
          <p>Are you sure you want to delete this council?</p>
          <div className={`${styles.modalButtons} ${styles.deleteBtn}`}>
            <button onClick={() => dialogRef.current.close()}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      </dialog>

      <EditCouncilModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedCouncil={selectedCouncil}
        handleUpdateCouncil={handleUpdateCouncil}
      />

      <Addcouncils
        showAddCouncilForm={showAddCouncilForm}
        setShowAddCouncilForm={setShowAddCouncilForm}
        handleAddCouncil={handleAddCouncil}
      />
    </div>
  );
};

export default CouncilsAndOrganizations;