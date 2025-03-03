import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import styles from "./SettingsModal.module.css";

const SettingsModal = ({ showSettingsModal, setShowSettingsModal }) => {
  const [selectedDays, setSelectedDays] = useState([]);

  const daysOfWeek = [
    "Sunday", // 0
    "Monday", // 1
    "Tuesday", // 2
    "Wednesday", // 3
    "Thursday", // 4
    "Friday", // 5
    "Saturday", // 6
  ];

  // Convert selected days to numbers
  const getDayNumbers = () =>
    selectedDays.map((day) => daysOfWeek.indexOf(day));

  // Load existing forbidden days from the database
  useEffect(() => {
    axios
      .get("/api/forbidden-days") // Adjust API endpoint
      .then((response) => {
        const savedDays = response.data.forbiddenDays.map(
          (num) => daysOfWeek[num]
        );
        setSelectedDays(savedDays);
      })
      .catch((error) => console.error("Error fetching forbidden days:", error));
  }, []);

  const handleCheckboxChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    const dayNumbers = getDayNumbers();

    axios
      .post("/api/forbidden-days", { forbiddenDays: dayNumbers }) // Adjust API endpoint
      .then(() => console.log("Forbidden days saved:", dayNumbers))
      .catch((error) => console.error("Error saving forbidden days:", error));

    setShowSettingsModal(false);
  };

  return (
    showSettingsModal && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Settings</h2>
          <p>Select forbidden days:</p>
          <div className={styles.checkboxContainer}>
            {daysOfWeek.map((day) => (
              <label key={day} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day)}
                  onChange={() => handleCheckboxChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={() => setShowSettingsModal(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsModal;
