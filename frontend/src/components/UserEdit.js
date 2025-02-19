import React, { useState, useEffect } from "react";
import styles from "./UserEdit.module.css"; // Adjust the import based on your file structure
import axios from 'axios'; // Import Axios
const UserEdit = ({ isOpen, closeModal, userData }) => {
  const [editedUser, setEditedUser] = useState({
    name: "",
    organizationz: "",
    username: "",
    email: "",
  });

  // 🟢 Update modal fields when userData changes
  useEffect(() => {
    console.log("UserEdit received userData:", userData); // 🟢 Debugging
    if (userData) {
      setEditedUser({
        name: userData.name || "",
        organizationz: userData.organizationz || "",
        username: userData.username || "",
        email: userData.email || "",
      });
    }
  }, [userData]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userData?.username) {
    console.error("Error: Username is missing!");
    return;
  }

  console.log("🔹 Sending update request for user:", userData.username, editedUser); // 🛠 Debugging

  try {
    const response = await axios.put(`http://localhost:5000/api/users-edit/${userData.username}`, editedUser);

    if (response.status === 200) {
      console.log("✅ User updated:", response.data);
      closeModal();
    } else {
      console.error("❌ Error updating user:", response.data.message);
    }
  } catch (error) {
    console.error("Update error:", error);
  }
};

  
  
  

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Edit User</h2>
        <button className={styles.closeButton} onClick={closeModal}>X</button>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="organizationz">Organization</label>
            <input
              type="text"
              id="organizationz"
              name="organizationz"
              value={editedUser.organizationz}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={editedUser.username}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
