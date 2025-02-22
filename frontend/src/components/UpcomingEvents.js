import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./PublicPage.module.css";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";


const UpcomingEvents = () => {
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

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
  const upcomingEvents = news.filter((item) => new Date(item.date) > now);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUpcomingEvents = upcomingEvents.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h3 className={styles.header}>Upcoming Events</h3>
      <div className={styles.upcomingCont}>
        {currentUpcomingEvents.length > 0 ? (
          currentUpcomingEvents.map((item) => (
            <div key={item.id} className={styles.newsItem}>
              <div className={styles.imgCont}>
                <a className={styles.imgCont} href={`https://event-booking-system-ckik.onrender.com/uploads/${item.photo}`}
                  target="_blank"
                  rel="noopener noreferrer"><img
                    src={`https://event-booking-system-ckik.onrender.com/uploads/${item.photo}`}
                    alt={item.name}
                    className={styles.newsImage}
                  /></a>
              </div>
              <div className={styles.itemInfo}>
                <h4>{item.name}</h4>
                <p>{item.organization}</p>
                <p>{item.duration} • {new Date(item.date).toLocaleDateString()} -{" "}
                  {new Date(item.datefrom).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No upcoming events available at the moment.</p>
        )}
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= upcomingEvents.length}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;
