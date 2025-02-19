// routes/route.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sendVerificationCode } = require('./mailer');
const { sendEventDeletionEmail } = require('./mailerdelete'); // Import the mailer function
const { mailerapproved } = require('./mailerapproved');
const router = express.Router();
const connection = require('../connection/db');  // import the database connection


/// Route to handle sending the event deletion email
router.post('/api/send-event-notification', async (req, res) => {
  const { organization, eventId } = req.body;
  console.log('Received request to send notification for event ID:', eventId, 'and organization:', organization); // Debug log

  if (!organization) {
    console.log('No organization provided.');
    return res.status(400).send({ message: 'Organization is required' });
  }

  try {
    // Step 1: Query the users table to find the email associated with the organization
    const query = `SELECT email FROM users WHERE organizationz = ?`;
    connection.query(query, [organization], (err, results) => {
      if (err) {
        console.log('Error querying the users table:', err);
        return res.status(500).send({ message: 'Error querying the users table' });
      }

      if (results.length > 0) {
        const userEmail = results[0].email; // Get the email from the query result

        // Step 2: Send the email notification
        const eventName = `Event ID ${eventId}`; // Replace with actual event name if needed
        sendEventDeletionEmail(userEmail, eventName); // Send email using the function

        res.status(200).send({ message: 'Notification sent to organization email' });
      } else {
        console.log('No user found for the organization:', organization);
        res.status(404).send({ message: 'Organization not found in users table' });
      }
    });
  } catch (error) {
    console.error('Error during notification process:', error);
    res.status(500).send({ message: 'Error processing request' });
  }
});



router.get('/api/events/:eventId/organization', async (req, res) => {
  const { eventId } = req.params;
  console.log('Fetching organization for event ID:', eventId);

  if (!eventId) {
      return res.status(400).send({ message: 'Event ID is required' });
  }

  try {
      // Query the events table to find the organization
      const query = `SELECT organization FROM events WHERE id = ?`;
      connection.query(query, [eventId], (err, results) => {
          if (err) {
              console.log('Error querying the events table:', err);
              return res.status(500).send({ message: 'Error querying events table' });
          }

          if (results.length > 0) {
              const organization = results[0].organization;
              console.log(`Organization found: ${organization}`);
              res.status(200).send({ organization });
          } else {
              console.log('No event found with that ID.');
              res.status(404).send({ message: 'Event not found' });
          }
      });
  } catch (error) {
      console.error('Error fetching organization:', error);
      res.status(500).send({ message: 'Server error' });
  }
});


router.post('/api/send-approved-notification', async (req, res) => {
  const { organization, eventId } = req.body;
  console.log('Received request to send notification for event ID:', eventId, 'and organization:', organization); // Debug log

  if (!organization) {
    console.log('No organization provided.');
    return res.status(400).send({ message: 'Organization is required' });
  }

  try {
    // Step 1: Query the users table to find the email associated with the organization
    const query = `SELECT email FROM users WHERE organizationz = ?`;
    connection.query(query, [organization], (err, results) => {
      if (err) {
        console.log('Error querying the users table:', err);
        return res.status(500).send({ message: 'Error querying the users table' });
      }

      if (results.length > 0) {
        const userEmail = results[0].email; // Get the email from the query result

        // Step 2: Send the email notification
        const eventName = `Event ID ${eventId}`; // Replace with actual event name if needed
        mailerapproved(userEmail, eventName); // Send email using the function

        res.status(200).send({ message: 'Notification sent to organization email' });
      } else {
        console.log('No user found for the organization:', organization);
        res.status(404).send({ message: 'Organization not found in users table' });
      }
    });
  } catch (error) {
    console.error('Error during notification process:', error);
    res.status(500).send({ message: 'Error processing request' });
  }
});


//sent email code 
router.post('/api/send-verification-code', (req, res) => {
  const { email } = req.body;
  console.log('Received request to send verification code for email:', email); // Debug log

  if (!email) {
    console.log('No email provided.');
    return res.status(400).send({ message: 'Email is required' });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate code
  console.log('Generated code:', code); // Debug log

  sendVerificationCode(email, code); // Send the email
  res.status(200).send({ message: 'Verification code sent', verificationCode: code });
});

router.get('/api/fetchpendingapproved/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT organization FROM events WHERE id = ?';
  connection.query(query, [id], (err, results) => {
      if (err) {
          console.error('Error fetching organization:', err);
          return res.status(500).json({ message: 'Error fetching organization', error: err });
      }

      if (results.length > 0) {
          res.status(200).json({ organization: results[0].organization });
      } else {
          res.status(404).json({ message: 'Event not found' });
      }
  });
});



// Get all councils
router.get('/councils', (req, res) => {
  const query = 'SELECT * FROM councils';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching councils' });
    }
    res.status(200).json(results);
  });
});






router.delete('/api/usersdel/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [id], (err, result) => {
      if (err) {
          console.error('Error deleting user:', err);
          return res.status(500).json({ error: 'Failed to delete user' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully' });
  });
});














module.exports = router;
