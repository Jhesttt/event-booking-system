import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        // Handle sign-up logic here (e.g., validation)
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post('https://event-booking-system-ckik.onrender.com/api/signup', {
                email,
                username,
                password,
                name,
            });
            console.log(response.data);
            // Optionally redirect after signup
            navigate('/login');
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Sign up failed');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.title}>Sign Up</h2>
                <form onSubmit={handleSignup} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name} // Corrected to `name`
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>Sign Up</button>
                </form>
            </div>
            <button style={styles.backButton} onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

// Inline styles for the Signup component
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full viewport height
        backgroundColor: '#f5f5f5', // Optional background color
    },
    title: {
        marginBottom: '20px',
        color: '#063970', // Optional title color
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column', // Align inputs vertically
        alignItems: 'center',
        width: '100%', // Full width for the form
    },
    input: {
        width: '250px', // Adjust width as needed
        padding: '10px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        width: '100%', // Full width for the button
        padding: '8px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#063970', // Button color
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    backButton: {
        marginTop: '20px', // Add space between the form and the back button
        backgroundColor: 'transparent',
        border: '1px solid #063970',
        color: '#063970',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
    },
};

export default Signup;
