// src/components/EventTable.js
import React, { useState } from 'react';
import styles from './Admin.module.css';
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";



const EventTable = ({ events, openApproveModal, openDeleteModal, handleViewDocument, handleViewImage, handleConfirm, handleDelete, handleButtonHover }) => {
  const [searchTerm, setSearchTerm] = useState('');

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
                        href={`https://event-booking-system-ckik.onrender.com/api/uploads/${event.documents}`}
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
                        href={`https://event-booking-system-ckik.onrender.com/api/uploads/${event.photo}`}
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
                    <div className={styles.actionFlex}>
                      <button
                        className={styles.requestActions}
                        onClick={() => openApproveModal(event.id, event.organization, event.name)} title='Accept Event'
                      >
                        <FaCheck />
                      </button>
                      <button
                        className={styles.requestActions}
                        onClick={() => openDeleteModal(event.id, event.organization, event.name)} title='Reject Event'
                      >
                        <FaTimes />
                      </button>
                    </div>
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
