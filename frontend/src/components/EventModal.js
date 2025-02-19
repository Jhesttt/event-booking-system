import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

const EventModal = ({ isModalOpen, setModalOpen, eventData, handleInputChange, handleFileChange, handleModalSubmit }) => {
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState(''); // For fromDate validation
  const [toDateError, setToDateError] = useState(''); // For toDate validation
  const [organization, setOrganization] = useState('');
 

  
  useEffect(() => {
    const storedOrganization = localStorage.getItem('userOrganization');
    if (storedOrganization) {
      setOrganization(storedOrganization);
      handleInputChange({ target: { name: 'organization', value: storedOrganization } }); // Update eventData
    }
  }, []);
  
  
 //testing start
// Function to convert 12-hour format (AM/PM) to 24-hour format

const convertTo24Hour = (time, ampm) => {
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  minutes = parseInt(minutes);

  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

const handleCheckConflict = async () => {
  try {
    // Convert user's from and to times to 24-hour format
    const userFrom = convertTo24Hour(eventData.fromHour + ":" + eventData.fromMinute, eventData.fromAmPm);
    const userTo = convertTo24Hour(eventData.toHour + ":" + eventData.toMinute, eventData.toAmPm);

    // Log the user input time in 24-hour format
    console.log("User Input Time (From - 24hr):", `${userFrom.hours}:${String(userFrom.minutes).padStart(2, '0')}`);
    console.log("User Input Time (To - 24hr):", `${userTo.hours}:${String(userTo.minutes).padStart(2, '0')}`);

    // Fetch saved durations from the database
    const response = await axios.get('http://localhost:5000/api/approved');
    const approvedEvents = response.data;

    // Loop through the approved events and check for conflicts
    for (let event of approvedEvents) {
      // Convert saved event duration to 24-hour format
      const [savedFrom, savedTo] = event.duration.split(' to ');

      const savedFromTime = convertTo24Hour(savedFrom.split(' ')[0] + ":" + savedFrom.split(' ')[1], savedFrom.split(' ')[1]);
      const savedToTime = convertTo24Hour(savedTo.split(' ')[0] + ":" + savedTo.split(' ')[1], savedTo.split(' ')[1]);

      // Log the saved event time in 24-hour format
      console.log("Saved Event Time (From - 24hr):", `${savedFromTime.hours}:${String(savedFromTime.minutes).padStart(2, '0')}`);
      console.log("Saved Event Time (To - 24hr):", `${savedToTime.hours}:${String(savedToTime.minutes).padStart(2, '0')}`);

      // Compare times
      if (
        (userFrom.hours < savedToTime.hours || (userFrom.hours === savedToTime.hours && userFrom.minutes < savedToTime.minutes)) &&
        (userTo.hours > savedFromTime.hours || (userTo.hours === savedFromTime.hours && userTo.minutes > savedFromTime.minutes))
      ) {
        setError('The selected time overlaps with an existing event.');
        return;
      }
    }

    setError(''); // No conflict found
  } catch (error) {
    console.error('Error checking time conflict:', error);
  }
};



// Helper function to convert a date in ISO format (e.g. 2025-11-05T16:00:00.000Z) to yyyy/mm/dd
const convertDatabaseDateToFormattedDate = (date) => {
  const newDate = new Date(date);  // Convert to JavaScript Date object
  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = newDate.getFullYear();
  return `${year}/${month}/${day}`;
};

const handleCheckDateOverlap = async () => {
  try {
    // Normalize user input dates
    const userFromDate = eventData.fromDate.replace(/-/g, '/');
    const userToDate = eventData.toDate ? eventData.toDate.replace(/-/g, '/') : userFromDate;

    // Fetch saved events from the database
    const response = await axios.get('http://localhost:5000/api/approved');
    const approvedEvents = response.data;

    const formattedEvents = approvedEvents.map(event => {
      const savedStartDate = convertDatabaseDateToFormattedDate(event.date);
      const savedEndDate = convertDatabaseDateToFormattedDate(event.datefrom);
      return { ...event, savedStartDate, savedEndDate };
    });

    // Check for date overlap
    for (let event of formattedEvents) {
      if (userFromDate <= event.savedEndDate && userToDate >= event.savedStartDate) {
        console.log("Date Overlap Found");
        setError('The selected dates overlap with an existing event.');
        return true;  // Return true if date overlap is found
      }
    }

    // If no date overlap found, clear the error
    console.log("No Date Overlap Found");
    setError('');
    return false;  // Return false if no date overlap is found
  } catch (error) {
    console.error('Error checking date conflict:', error);
    return false;  // Return false in case of any error
  }
};





const eventHandleCheck = async () => {
  try {
    const venue = eventData.venue;  // Get the selected venue from the form

    // Fetch existing venues from the database
    const response = await axios.get('http://localhost:5000/api/approved');  // Replace with your API endpoint
    const existingVenues = response.data;

    // Log the user selected venue and the saved venues from the database
    console.log('User Selected Venue:', venue);
    console.log('Saved Venues in Database:', existingVenues);

    // Check if the selected venue exists in the database by comparing names
    const venueExists = existingVenues.some((existingVenue) => existingVenue.venue === venue);

    // Log the result
    console.log('Venue Exists:', venueExists);

    return venueExists;  // Return true if the venue exists, false if not
  } catch (error) {
    console.error('Error checking venue existence:', error);
    return false;  // Return false if there's an error
  }
};









 //testing end 




  
  useEffect(() => {
    if (isModalOpen) {
      axios.get('http://localhost:5000/api/organizations')
        .then(response => {
          setOrganizations(response.data);
        })
        .catch(error => {
          console.error('Error fetching organizations:', error);
        });
    }
  }, [isModalOpen]);

  const twoWeeksAhead = new Date();
  twoWeeksAhead.setDate(twoWeeksAhead.getDate() + 14);
  const minDate = twoWeeksAhead.toISOString().split('T')[0];

  const handleDateValidation = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj < twoWeeksAhead) {
        setError('The date must be at least two weeks from today.');
      } else {
        setError('');
      }
    }
  };





  

  const handleToDateValidation = (e) => {
    const fromDate = new Date(eventData.fromDate);
    const toDate = new Date(e.target.value);
    
    if (toDate < fromDate) {
      setToDateError('The "To Date" cannot be earlier than the "From Date".');
    } else {
      setToDateError('');
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      const fromDateInput = document.querySelector('input[name="fromDate"]');
      fromDateInput.addEventListener('blur', handleDateValidation);

      return () => {
        fromDateInput.removeEventListener('blur', handleDateValidation);
      };
    }
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add Event</h3>
        <form onSubmit={handleModalSubmit} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label>Venue:</label>
            <select
              name="venue"
              value={eventData.venue}
              onChange={handleInputChange}
              required
              className={styles.input}
            >
              <option value="">Select Venue</option>
              <option value="Court">Court</option>
    
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={eventData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>
      <div className={styles.formGroup}>
  <label>Organization:</label>
  <select
    name="organization"
    value={organization || eventData.organization} // Automatically fills with stored organization if available
    onChange={handleInputChange}
    required
    className={styles.input}
    disabled={!organization} // Disable the dropdown only if organization is NOT available
  >
    <option value="">Select Organization</option>
    {organizations.length > 0 ? (
      organizations.map((org, index) => (
        <option key={index} value={org.organization}>
          {org.organization}
        </option>
      ))
    ) : (
      <option disabled>Loading...</option>
    )}
  </select>
</div>

          <div className={styles.formGroup}>
            <label>From Date:</label>
            <input
              type="date"
              name="fromDate"
              value={eventData.fromDate}
              onChange={handleInputChange}
              required
              className={styles.input}
              min={minDate}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>To Date (Optional):</label>
            <input
              type="date"
              name="toDate"
              value={eventData.toDate}
              onChange={(e) => {
                handleInputChange(e);
                handleToDateValidation(e);
              }}
              className={styles.input}
            />
            {toDateError && <p className={styles.error}>{toDateError}</p>}
          </div>

          <div className={styles.formGroup}>
            <label>Time Duration:</label>
            <div className={styles.timeGroup}>
              <span>From:</span>
              <div className={styles.timeFromGroup}>
                <select
                  name="fromHour"
                  value={eventData.fromHour}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select Hour</option>
                  {[...Array(12).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="fromMinute"
                  value={eventData.fromMinute}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  {[...Array(60).keys()].map((i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="fromAmPm"
                  value={eventData.fromAmPm}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <span>to:</span>

              <div className={styles.timeToGroup}>
                <select
                  name="toHour"
                  value={eventData.toHour}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select Hour</option>
                  {[...Array(12).keys()].map((i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select
                  name="toMinute"
                  value={eventData.toMinute}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  {[...Array(60).keys()].map((i) => (
                    <option key={i} value={String(i).padStart(2, '0')}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  name="toAmPm"
                  value={eventData.toAmPm}
                  onChange={handleInputChange}
                  className={styles.timeInput}
                >
                  <option value="">Select AM/PM</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Document:</label>
            <input
              type="file"
              name="document"
              accept=".pdf"
              onChange={handleFileChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Poster:</label>
            <input
              type="file"
              name="poster"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              onChange={handleFileChange}
              required
              className={styles.input}
            />
          </div>
          {/* Display the error message */}
    {error && (
      <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
        {error}
      </div>
    )}

          <div className={styles.modalFooter}>
              
             <button type="submit" className={styles.submitButton}>
        Submit
      </button>
            <button
              onClick={() => setModalOpen(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>


           
          </div>
         

          





        </form>









      </div>
    </div>
  );
};

export default EventModal; 