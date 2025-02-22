import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./eventhistory.module.css";

const EventHistory = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchApprovedData = async () => {
      try {
        const response = await axios.get("https://event-booking-system-ckik.onrender.com/api/approvedhistory");
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching approved data:", error);
        setNews([]);
      }
    };

    fetchApprovedData();
  }, []);

  const now = new Date();
  const pastEvents = news.filter((item) => new Date(item.date) <= now);

  return (
    <div className={styles.historyCont}>
      <h2 className={styles.header}>History</h2>
      <p>View all previous events.</p>
      <div className={styles.historyGrid}>
        {pastEvents.length > 0 ? (
          pastEvents.map((item) => (
            <div key={item.id} className={styles.newsItem}>
              <div className={styles.imgCont} >
                <a className={styles.imgCont} href={`https://event-booking-system-ckik.onrender.com/api/uploads/${item.documents}`}
                  target="_blank"
                  rel="noopener noreferrer"><img
                    src={`https://event-booking-system-ckik.onrender.com/api/uploads/${item.photo}`}
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
          <p>No past events available at the moment.</p>
        )}
      </div>

    </div>
  );
};

export default EventHistory;
