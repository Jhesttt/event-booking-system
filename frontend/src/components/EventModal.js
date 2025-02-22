import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import { toast } from "sonner";

const EventModal = ({ isModalOpen, setModalOpen, eventData, handleInputChange, handleFileChange, handleModalSubmit }) => {
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState(''); // For fromDate validation
  const [toDateError, setToDateError] = useState(''); // For toDate validation
  const [organization, setOrganization] = useState('');


  useEffect(() => {
    const storedOrganization = localStorage.getItem('userOrganization');
    if (storedOrganization) {
      setOrganization(storedOrganization);
    }
  }, []);

  //testing start
  // Function to convert 12-hour format (AM/PM) to 24-hour format





  useEffect(() => {
    if (isModalOpen) {
      axios.get('https://event-booking-system-ckik.onrender.com/api/organizations')
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

  const isFridayOrSunday = (date) => {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 5 || dayOfWeek === 0;  // 5 = Friday, 0 = Sunday
  };


  const handleFromDateValidation = (e) => {
    const selectedDate = e.target.value;
    if (isFridayOrSunday(selectedDate)) {
      toast.error("Fridays and Sundays are not allowed.", { duration: 4000 });

      // Reset the input value by updating the state via handleInputChange
      handleInputChange({
        target: {
          name: "fromDate",
          value: "",  // Clear the input value
        },
      });
    }
  };

  const handleToDateValidation = (e) => {
    const selectedDate = e.target.value;
    if (isFridayOrSunday(selectedDate)) {
      toast.error("Fridays and Sundays are not allowed.", { duration: 4000 });

      // Reset the input value by updating the state via handleInputChange
      handleInputChange({
        target: {
          name: "toDate",
          value: "",  // Clear the input value
        },
      });
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
        <h3 className={styles.modalHeader}>Add Event</h3>
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
            <label>Start Date:</label>
            <input
              type="date"
              name="fromDate"
              value={eventData.fromDate}
              onChange={(e) => { handleInputChange(e); handleFromDateValidation(e); }}
              required
              className={styles.input}
              min={minDate}
            />
            {/* {error && <p className={styles.error}>{error}</p>} */}
          </div>

          <div className={styles.formGroup}>
            <label>End Date</label>
            <input
              type="date"
              name="toDate"
              value={eventData.toDate}
              onChange={(e) => {
                handleInputChange(e);
                handleToDateValidation(e);
              }}
              className={styles.input}
              min={minDate}
              required
            />
            {/* {toDateError && <p className={styles.error}>{toDateError}</p>} */}
          </div>

          <div className={styles.formGroup}>
            {/* <label>Time Duration:</label> */}
            <div className={styles.timeGroup}>
              <div className={styles.fromGroup}>
                <label>Start Time:</label>
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
                    <option value="">AM / PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className={styles.toGroup}>
                <label>End Time:</label>
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
                    <option value="">AM / PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
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
          {/* {error && (
            <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </div>
          )} */}

          <div className={styles.modalFooter}>
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal; 