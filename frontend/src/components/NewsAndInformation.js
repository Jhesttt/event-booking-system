import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PublicPage.module.css";

const NewsAndInformation = () => {
  const [news, setNews] = useState([]); // Store all the news
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage] = useState(5); // Number of items to display per page

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const response = await axios.get("https://event-booking-system-ckik.onrender.com/api/approved");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching approved data:", error);
        setNews([]);
      }
    };

    fetchApprovedData();
  }, []);

  const now = new Date();

  // Separate the events
  const upcomingEvents = news.filter((item) => new Date(item.date) > now);
  const pastEvents = news.filter((item) => new Date(item.date) <= now);

  // Pagination logic for Upcoming Events
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUpcomingEvents = upcomingEvents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.rightSection}>
      <h3 className={styles.header}>Upcoming Events</h3>
      {currentUpcomingEvents.length > 0 ? (
        currentUpcomingEvents.map((item) => (
          <div key={item.id} className={styles.newsItem}>
            <img
              src={`https://event-booking-system-ckik.onrender.com/uploads/${item.photo}`}
              alt={item.name}
              className={styles.newsImage}
            />
            <h4>{item.name}</h4>
            <p>
              Venue: {item.venue} <br />
              Organization: {item.organization} <br />
              Duration: {item.duration} hours <br />
              Date: {new Date(item.date).toLocaleDateString()} -{" "}
              {new Date(item.datefrom).toLocaleDateString()}
            </p>
            <a
              href={`https://event-booking-system-ckik.onrender.com/uploads/${item.documents}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.documentLink}
            >
              View Document
            </a>
          </div>
        ))
      ) : (
        <p>No upcoming events available at the moment.</p>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= upcomingEvents.length}
        >
          Next
        </button>
      </div>

      <h3 className={styles.header}>Event History</h3>
      {pastEvents.length > 0 ? (
        pastEvents.map((item) => (
          <div key={item.id} className={styles.newsItem}>
            <img
              src={`https://event-booking-system-ckik.onrender.com/uploads/${item.photo}`}
              alt={item.name}
              className={styles.newsImage}
            />
            <h4>{item.name}</h4>
            <p>
              Venue: {item.venue} <br />
              Organization: {item.organization} <br />
              Duration: {item.duration} hours <br />
              Date: {new Date(item.date).toLocaleDateString()} -{" "}
              {new Date(item.datefrom).toLocaleDateString()}
            </p>
            <a
              href={`https://event-booking-system-ckik.onrender.com/uploads/${item.documents}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.documentLink}
            >
              View Document
            </a>
          </div>
        ))
      ) : (
        <p>No past events available at the moment.</p>
      )}
    </div>
  );
};

export default NewsAndInformation;
