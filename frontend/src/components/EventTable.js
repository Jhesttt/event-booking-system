// src/components/EventTable.js
import React, { useState } from 'react';
import styles from './Admin.module.css';
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";



const EventTable = ({ events, openApproveModal, openDeleteModal, handleViewDocument, handleViewImage, handleConfirm, handleDelete, handleButtonHover }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState(""); 
  const [verifiedEvents, setVerifiedEvents] = useState({}); 

  // Function to format the date as YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) ? parsedDate.toLocaleDateString('en-GB') : "";
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleCheckDateAndTimeExists = async (selectedEvent) => {
    console.log('📝 Selected event:', selectedEvent);
    console.log('📅 Checking for overlapping dates:', formatDate(selectedEvent.date), 'to', formatDate(selectedEvent.datefrom));
    console.log('⏳ Selected row duration:', selectedEvent.duration || 'N/A'); 

    try {
        const response = await fetch('http://localhost:5000/api/date-timecheck');
        const approvedEvents = await response.json();

        const overlappingEvent = approvedEvents.find(approvedEvent => 
            selectedEvent.date <= approvedEvent.datefrom && selectedEvent.datefrom >= approvedEvent.date
        );

        if (overlappingEvent) {
            console.log(`✅ Overlap found! Approved event: ${formatDate(overlappingEvent.date)} to ${formatDate(overlappingEvent.datefrom)}`);
            console.log(`⏳ Approved event duration: ${overlappingEvent.duration || 'N/A'}`);

            if (selectedEvent.duration && overlappingEvent.duration) {
                const [start1, end1] = convertTo24Hour(selectedEvent.duration);
                const [start2, end2] = convertTo24Hour(overlappingEvent.duration);

                if (isValidTimeRange(start1, end1) && isValidTimeRange(start2, end2)) {
                    if ((start1 < end2 && end1 > start2)) {
                       setErrorMessage(`⚠️ Time overlap detected: ${start1}-${end1} conflicts with ${start2}-${end2}`);
    return;
                    } else {
                        console.log('✅ No time overlap.');
                    }
                } else {
                    console.log('⚠️ One or both events have times outside 07:00-18:00.');
                    return;
                }
            } else {
                console.log('⚠️ Could not parse one or both event durations.');
                return;
            }
        } 

        console.log('✅ No overlapping events.');

        // If no overlap, mark this event as verified
        setVerifiedEvents(prev => ({ ...prev, [selectedEvent.id]: true }));

    } catch (error) {
        console.error('❌ Error fetching approved events:', error);
    }
  };

  const convertTo24Hour = (duration) => {
    try {
        const [start, end] = duration.split(' to ');
        return [convertSingleTime(start), convertSingleTime(end)];
    } catch {
        return [null, null];
    }
  };

  const convertSingleTime = (time) => {
    const [hour, minute] = time.match(/\d+/g);
    const isPM = time.includes('PM');
    let convertedHour = isPM && hour !== "12" ? parseInt(hour) + 12 : hour;
    if (!isPM && hour === "12") convertedHour = "00";
    return `${convertedHour}:${minute}`;
  };

  const isValidTimeRange = (start, end) => {
    return start >= "07:00" && end <= "18:00";
  };

  return (
    <div className={styles.eventReqCont}>

      <h2>Event Requests</h2>
      <p>Managing Event Requests – Review, Approve, and Decline Submissions</p>
      <div className={styles.searchWrap}>
        <input
          type="text"
          placeholder="Search events..."
          className={styles.searchBar}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FaSearch className={styles.searchIcon} />
      </div>
      <div className={styles.sectionBox}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Organization</th>
              <th className={styles.tableCell}>Date</th>
              <th className={styles.tableCell}>Duration</th>
              <th className={styles.tableCell}>Documents</th>
              <th className={styles.tableCell}>Photo</th>
              <th className={styles.tableCell}>Venue</th>
              <th className={styles.tableCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{event.name}</td>
                  <td className={styles.tableCell}>{event.organization}</td>
                  <td className={styles.tableCell}>{formatDate(event.date)} to {formatDate(event.datefrom)}</td>
                  <td className={styles.tableCell}>{event.duration}</td>
                  <td className={styles.tableCell}>
                    {event.documents && (
                      <a
                        href={`http://localhost:5000/uploads/${event.documents}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewDocs}
                      // onClick={() => handleViewDocument(event.documents, event.name)}
                      // onMouseEnter={(e) => handleButtonHover(e, true)}
                      // onMouseLeave={(e) => handleButtonHover(e, false)}
                      >
                        View Document
                      </a>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    {event.photo && (
                      <a
                        href={`http://localhost:5000/uploads/${event.photo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.viewDocs}
                      // onClick={() => handleViewImage(event.photo)}
                      // onMouseEnter={(e) => handleButtonHover(e, true)}
                      // onMouseLeave={(e) => handleButtonHover(e, false)}
                      >
                        View Image
                      </a>
                    )}
                  </td>
                  <td className={styles.tableCell}>{event.venue}</td>
                  <td className={styles.tableCell}>
                  {!verifiedEvents[event.id] ? (
                    <button 
                      className={styles.button} 
                      onClick={() => handleCheckDateAndTimeExists(event)}
                    >
                      Verify
                    </button>
                  ) : (
                    <button
                      className={styles.button}
                      onClick={() => handleConfirm(event.id)}
                    >
                      ✔ Confirm
                    </button>
                  )}
                  <button
                    className={styles.button}
                    onClick={() => handleDelete(event.id)}
                  >
                    ❌
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={styles.noEvents}>No events available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EventTable;
