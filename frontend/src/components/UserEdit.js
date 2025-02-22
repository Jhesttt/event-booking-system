import React, { useState } from "react";
import styles from "./UserEdit.module.css"; // Adjust the import based on your file structure
import axios from "axios";
import { toast } from "sonner";

const UserEdit = ({ isOpen, closeModal, userData, setRefreshUser }) => {
  const [editedUser, setEditedUser] = useState({
    id: userData.id || "",
    name: userData.name || "",
    username: userData.username || "",
    email: userData.email || ""
  });
  const [Error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const { username, email } = editedUser;
    if (!email.includes("@") || !email.includes(".")) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateInputs()) return;

    try {
      const response = await axios.put(`https://event-booking-system-ckik.onrender.com/api/users/${editedUser.id}`, editedUser);
      toast.success("User updated successfully:", { duration: 4000 })
      console.log("User updated successfully:", response.data);
      setRefreshUser((prev) => !prev);
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user", { duration: 4000 });
    }
  };


  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedUser.name}
              onChange={handleInputChange}
            />
          </div> */}

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

          <div className={styles.buttonFlex}>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
