import React, { useState } from "react";
import styles from "./Addcouncils.module.css"; // Import the styles
import { toast } from "sonner";

const AddCouncils = ({ showAddCouncilForm, setShowAddCouncilForm }) => {
  const [councilFormData, setCouncilFormData] = useState({
    organization: "",
    adviser: "",
    adviserPicture: null,
    link: "",
    president: "",
    vicePresident: "",
    secretary: "",
    treasurer: "",
    auditor: "",
    pro: "",
    rep: "",
    representative: "",
    thirdRepresentative: "", // New field
    fourthRepresentative: "" // New field
  });

  const handleAddCouncil = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(councilFormData).forEach((key) => {
      if (key === 'adviserPicture' && councilFormData[key]) {
        formData.append(key, councilFormData[key]);
      } else {
        formData.append(key, councilFormData[key]);
      }
    });

    try {
      const response = await fetch('https://event-booking-system-ckik.onrender.com/api/councils-add', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Council added successfully", {
          duration: 4000, // Time before it disappears
        });
        setShowAddCouncilForm(false);
      } else {
        toast.error('Error saving council data: ' + data.message, {
          duration: 4000, // Time before it disappears
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form', {
        duration: 4000, // Time before it disappears
      });
    }
  };

  return (
    showAddCouncilForm && (
      <div className={styles.modalWrapper}>
        <div className={styles.sectionBox}>
          <form onSubmit={handleAddCouncil} className={styles.form}>
            <div className={styles.formGroup}>
              <h1 className={styles.header}>Add Council/Organization</h1>
              <label>Organization/Council:</label>
              <input
                type="text"
                value={councilFormData.organization}
                onChange={(e) => setCouncilFormData({ ...councilFormData, organization: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Adviser:</label>
              <div className={styles.adviserGroup}>
                <input
                  type="text"
                  value={councilFormData.adviser}
                  onChange={(e) => setCouncilFormData({ ...councilFormData, adviser: e.target.value })}
                  className={styles.input}
                />
                <div className={styles.logo}>
                  <label>Logo: </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) =>
                      setCouncilFormData({ ...councilFormData, adviserPicture: e.target.files[0] })
                    }
                    className={styles.fileInput}
                  />

                </div>

              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Link</label>
              <input
                type="text"
                value={councilFormData.link}
                onChange={(e) => setCouncilFormData({ ...councilFormData, link: e.target.value })}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>President:</label>
              <input
                type="text"
                value={councilFormData.president}
                onChange={(e) => setCouncilFormData({ ...councilFormData, president: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vice-President:</label>
              <input
                type="text"
                value={councilFormData.vicePresident}
                onChange={(e) => setCouncilFormData({ ...councilFormData, vicePresident: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Secretary:</label>
              <input
                type="text"
                value={councilFormData.secretary}
                onChange={(e) => setCouncilFormData({ ...councilFormData, secretary: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Treasurer:</label>
              <input
                type="text"
                value={councilFormData.treasurer}
                onChange={(e) => setCouncilFormData({ ...councilFormData, treasurer: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Auditor:</label>
              <input
                type="text"
                value={councilFormData.auditor}
                onChange={(e) => setCouncilFormData({ ...councilFormData, auditor: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>P.R.O:</label>
              <input
                type="text"
                value={councilFormData.pro}
                onChange={(e) => setCouncilFormData({ ...councilFormData, pro: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>First-Year Representative:</label>
              <input
                type="text"
                value={councilFormData.rep}
                onChange={(e) => setCouncilFormData({ ...councilFormData, rep: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Second-Year Representative:</label>
              <input
                type="text"
                value={councilFormData.representative}
                onChange={(e) => setCouncilFormData({ ...councilFormData, representative: e.target.value })}
                className={styles.input}
              />
            </div>
            {/* Add new input fields for third and fourth representatives */}
            <div className={styles.formGroup}>
              <label>Third-Year Representative:</label>
              <input
                type="text"
                value={councilFormData.thirdRepresentative}
                onChange={(e) => setCouncilFormData({ ...councilFormData, thirdRepresentative: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Fourth-Year Representative:</label>
              <input
                type="text"
                value={councilFormData.fourthRepresentative}
                onChange={(e) => setCouncilFormData({ ...councilFormData, fourthRepresentative: e.target.value })}
                className={styles.input}
              />
            </div>
            {/* ...other form fields for president, vice-president, etc... */}
            <div className={styles.formButtons}>

              <button
                type="button"
                onClick={() => setShowAddCouncilForm(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>

              <button type="submit" className={styles.submitButton}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddCouncils;
