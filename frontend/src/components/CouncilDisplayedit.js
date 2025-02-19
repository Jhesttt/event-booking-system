import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css'; // For dashboard styles

const CouncilDisplayedit = () => {
  const [councilsAndOrganizations, setCouncilsAndOrganizations] = useState([]);
  const [selectedCouncil, setSelectedCouncil] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [organization, setOrganization] = useState('');

  // Fetch all councils data on component mount
  useEffect(() => {


    const storedOrganization = localStorage.getItem('userOrganization');
    if (storedOrganization) {
      setOrganization(storedOrganization);
    }

    const fetchCouncils = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/councils');
        setCouncilsAndOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching councils:', error);
      }
    };

    fetchCouncils();
  }, []);

  // Open edit modal and populate form with selected council data
  const openEditModal = () => {
    if (selectedCouncil) {
      // Remove 'createdAt' from selected council data
      const { createdAt, ...filteredData } = selectedCouncil;
      setFormData(filteredData); // Set formData without 'createdAt'
      setIsEditModalOpen(true); // Open the modal
    }
  };

  // Handle input change in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for editing
  const handleEditCouncil = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.put(`http://localhost:5000/api/councilsedit/${formData.id}`, formData); // formData shouldn't include 'created_at'
      if (response.status === 200) {
        alert('Council details updated successfully!');
        setIsEditModalOpen(false);
      } else {
        alert('Failed to update council details.');
      }
    } catch (error) {
      console.error('Error updating council:', error);
      alert('An error occurred while updating council details.');
    }
  };

  return (
    <div className={styles.leftSection}>
      <h2 className={styles.header}>Councils and Organization List</h2>


      


      <div className={styles.sidebarContainer}>
        <div className={styles.sidebar}>
          {councilsAndOrganizations.map((item) => (
            <button
              key={item.organization}
              onClick={() => setSelectedCouncil(item)}
              className={`${styles.sidebarButton} ${selectedCouncil?.organization === item.organization ? styles.selected : ''}`}
            >
              {item.organization}
            </button>
          ))}
        </div>

        <div className={styles.sidebarContent}>
          <h3>{selectedCouncil ? selectedCouncil.organization : 'Select a Council/Organization'}</h3>

          {selectedCouncil && (
            <div className={styles.details}>
                {selectedCouncil.organization === organization && (
              <button className={styles.editButton} onClick={openEditModal}>Edit</button> )}
              <table>
                <tbody>
                <tr>
              
              <td>
                <a href={selectedCouncil.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`http://localhost:5000/adviserpic/${selectedCouncil.adviserPIC}`}
                    alt="Adviser"
                    className={styles.adviserImage}
                  />
                </a>
              </td>
            </tr>
                  <tr>
                    <td><strong>Adviser:</strong></td>
                    <td>{selectedCouncil.adviser}</td>
                  </tr>
                  <tr>
                    <td><strong>President:</strong></td>
                    <td>{selectedCouncil.president}</td>
                  </tr>
                  <tr>
                    <td><strong>Vice President:</strong></td>
                    <td>{selectedCouncil.vicePresident}</td>
                  </tr>
                  <tr>
                    <td><strong>Secretary:</strong></td>
                    <td>{selectedCouncil.secretary}</td>
                  </tr>
                  <tr>
                    <td><strong>Treasurer:</strong></td>
                    <td>{selectedCouncil.treasurer}</td>
                  </tr>
                  <tr>
                    <td><strong>Auditor:</strong></td>
                    <td>{selectedCouncil.auditor}</td>
                  </tr>
                  <tr>
                    <td><strong>PRO:</strong></td>
                    <td>{selectedCouncil.pro}</td>
                  </tr>
                  <tr>
                    <td><strong> First year representative:</strong></td>
                    <td>{selectedCouncil.rep}</td>
                  </tr>
                  <tr>
                    <td><strong>Second year representative :</strong></td>
                    <td>{selectedCouncil.representative}</td>
                  </tr>
                  <tr>
                    <td><strong>Third year representative :</strong></td>
                    <td>{selectedCouncil.trdrepresentative}</td>
                  </tr>
                  <tr>
                    <td><strong>Fourth year representative :</strong></td>
                    <td>{selectedCouncil.frthrepresentative}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCouncil && (
  <div className={styles.modalWrapper}>
    <div className={styles.modalContent}>
      <h3>Edit Council Details</h3>
      <form onSubmit={handleEditCouncil} className={styles.form}>
        {Object.keys(formData).map((field) => {
           if (field === "id" || field === "adviserPIC") return null;
          const fieldLabels = {
            organization: "Organization",
            adviser: "Adviser",
            president: "President",
            vicePresident: "Vice President",
            secretary: "Secretary",
            treasurer: "Treasurer",
            auditor: "Auditor",
            pro: "PRO",
            rep: "First Year Representative",
            representative: "Second Year Representative",
            trdrepresentative: "Third Year Representative",
            frthrepresentative: "Fourth Year Representative",
          };

          return (
            field !== "id" && (
              <div key={field} className={styles.formGroup}>
                <label><strong>{fieldLabels[field] || field}:</strong></label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            )
          );
        })}

        <div className={styles.formButtons}>
          <button type="submit" className={styles.submitButton}>Save</button>
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default CouncilDisplayedit;
