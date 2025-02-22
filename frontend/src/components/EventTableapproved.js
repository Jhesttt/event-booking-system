import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './Admin.module.css';
import { FaSearch } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { FaRegTimesCircle } from "react-icons/fa";
import { toast } from "sonner";

const EventTableApproved = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const dialogRef = useRef(null);

  // Fetch events function
  const fetchEvents = async () => {
    try {
      const response = await axios.get("https://event-booking-system-ckik.onrender.com/api/approved");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    return !isNaN(parsedDate) ? parsedDate.toLocaleDateString('en-GB') : "";
  };

  const handleViewDocument = (documentName) => {
    const fullDocumentUrl = `https://event-booking-system-ckik.onrender.com/uploads/${documentName}`;
    setSelectedDocument(fullDocumentUrl);
    setSelectedDocumentName(documentName);
    setShowDocumentModal(true);
  };

  const handleCloseDocumentModal = () => {
    setShowDocumentModal(false);
    setSelectedDocument(null);
    setSelectedDocumentName(null);
  };

  const handleViewImage = (imageName) => {
    const fullImageUrl = `https://event-booking-system-ckik.onrender.com/uploads/${imageName}`;
    setSelectedDocument(fullImageUrl);
    setSelectedDocumentName(imageName);
    setShowDocumentModal(true);
  };

  const handleDeleteApproved = async (id) => {
    setEventToDelete(id);
    dialogRef.current.showModal();
  };

  const sendCancelEventNotification = async (organization, eventId, eventName) => {
    try {
      const response = await axios.post("https://event-booking-system-ckik.onrender.com/api/send-event-cancellation-notification", {
        organization,
        eventId,
        eventName,
      });
      console.log("Cancellation notification response:", response.data);
    } catch (error) {
      console.error("Error sending cancellation notification:", error);
    }
  };


  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`https://event-booking-system-ckik.onrender.com/api/approved-table/${eventToDelete}`);
      if (response.status === 200) {
        // Find the event details (for notification) before removing it from state
        const eventCanceled = events.find((event) => event.id === eventToDelete);

        setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventToDelete));
        toast.success('Event deleted successfully', {
          duration: 4000, // Time before it disappears
        });

        // Send cancellation notification if event details are available
        if (eventCanceled) {
          await sendCancelEventNotification(eventCanceled.organization, eventCanceled.id, eventCanceled.name);
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error);
      toast.error('Failed to delete event', {
        duration: 4000, // Time before it disappears
      });
    } finally {
      dialogRef.current.close();
    }
  };


  // Filter events based on the search term
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.upcomingEventsCont}>
      <h2>Upcoming Events</h2>
      <p>Check documents, view banners, cancel, and search upcoming events.</p>
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
                      <a className={styles.viewDocs} href={`https://event-booking-system-ckik.onrender.com/uploads/${event.documents}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        View Document
                      </a>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    {event.photo && (
                      <a className={styles.viewDocs} href={`https://event-booking-system-ckik.onrender.com/uploads/${event.photo}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        View Image
                      </a>
                    )}
                  </td>
                  <td className={styles.tableCell}>{event.venue}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionFlex}>
                      <button className={styles.approvedActions} onClick={() => handleDeleteApproved(event.id)} title='Cancel Events'>
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

      {showDocumentModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={handleCloseDocumentModal}>&times;</span>
            <h2>{selectedDocumentName}</h2>
            <iframe src={selectedDocument} title={selectedDocumentName} className={styles.modalIframe}></iframe>
          </div>
        </div>
      )}

      <dialog ref={dialogRef} className={styles.modal}>
        <div className={styles.modalBox}>
          <FaRegTimesCircle className={`${styles.modalIcon} ${styles.deleteIcon}`} />
          <p>Are you sure you want to cancel this event?</p>
          <div className={`${styles.modalButtons} ${styles.deleteBtn}`}>
            <button onClick={() => dialogRef.current.close()}>Cancel</button>
            <button onClick={confirmDelete}>Delete</button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default EventTableApproved;