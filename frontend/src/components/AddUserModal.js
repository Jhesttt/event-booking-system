import React, { useState, useEffect } from 'react';
import styles from './Addusermodal.module.css';  // Assuming you have styles for the modal
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AddUserModal = ({ isOpen, closeModal, addUser }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organizationz, setOrganizationz] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await fetch('https://event-booking-system-ckik.onrender.com/api/organizations');
                const data = await response.json();
                if (response.ok) {
                    setOrganizations(data);
                } else {
                    console.error('Failed to fetch organizations:', data.message);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
            }
        };

        fetchOrganizations();
    }, []);

    const resetForm = () => {
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setOrganizationz('');
        setPasswordError('');
        setEmailError('');
        setUsernameError('');
    };

    const handleCancel = () => {
        resetForm();
        closeModal();
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(value)) {
            setPasswordError('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number.');
        } else {
            setPasswordError('');
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };

    const handleUsernameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        setUsernameError('');

        if (value) {
            checkUsernameExistence(value);
        }
    };

    const checkUsernameExistence = async (username) => {
        try {
            const response = await fetch(`https://event-booking-system-ckik.onrender.com/api/check-username?username=${username}`);
            const data = await response.json();
            if (data.exists) {
                setUsernameError('Username already exists.');
            } else {
                setUsernameError('');
            }
        } catch (error) {
            console.error('Error checking username:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordError && !usernameError) {
            const user = { name, username, email, password, organizationz };

            try {
                const response = await fetch('https://event-booking-system-ckik.onrender.com/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user),
                });

                const data = await response.json();
                if (response.ok) {
                    addUser(data);
                    toast.success("User added successfully", { duration: 4000 });
                    resetForm();
                    closeModal();
                } else {
                    // This toast will now also handle the "one account per organization" error
                    toast.error(`Failed to add user: ${data.message}`, { duration: 4000 });
                }
            } catch (error) {
                toast.error(`Error adding user: ${error.message}`, { duration: 4000 });
            }
        }
    };

    return (
        isOpen && (
            <div className={styles.modal}>
                <div className={styles.modalContent}>
                    <h2>Add User</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* <div className={styles.inputGroup}>
                            <label>Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div> */}
                        <div className={styles.inputGroup}>
                            <label>Username</label>
                            <input type="text" value={username} onChange={handleUsernameChange} required />
                            {usernameError && <span className={styles.error}>{usernameError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input type="email" value={email} onChange={handleEmailChange} required />
                            {emailError && <span className={styles.error}>{emailError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Password</label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {passwordError && <span className={styles.error}>{passwordError}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Organization</label>
                            <select value={organizationz} onChange={(e) => setOrganizationz(e.target.value)} required>
                                <option value="">Select Organization</option>
                                {organizations.map((org, index) => (
                                    <option key={index} value={org.organization}>{org.organization}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.buttonFlex}>
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            <button type="submit" className={styles.submitButton} disabled={passwordError || usernameError}>Add User</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddUserModal;
