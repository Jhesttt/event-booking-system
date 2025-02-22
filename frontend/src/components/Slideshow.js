import React, { useState, useEffect, useMemo } from "react";
import styles from "./PublicPage.module.css";
import placeholder from "../assets/placeholder.png";

const Slideshow = () => {
  const [imageFiles, setImageFiles] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Fetch the image filenames from the backend on component mount
  useEffect(() => {
    fetch("https://event-booking-system-ckik.onrender.com/api/slideshow-images")
      .then((response) => response.json())
      .then((data) => {
        setImageFiles(data); // Set the filenames from backend
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  // Memoize the image URLs based on the filenames fetched
  const images = useMemo(() => {
    return imageFiles.map((image) => `https://event-booking-system-ckik.onrender.com/uploads/${image}`);
  }, [imageFiles]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
        setIsFading(false);
      }, 300); // Duration of fade-out matches CSS
    }, 8000); // Change slides every 6 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={styles.slideshowCont}>
      <div
        className={`${styles.upcomingEventsImageContainer} ${isFading ? styles.fade : ""
          }`}
      >
        {images.length > 0 ? (
          <img
            src={images[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className={styles.upcomingEventImage}
          />
        ) : (
          <img
            src={placeholder}
            alt="Placeholder Image"
            className={styles.upcomingEventImage}
          />
        )}
      </div>
    </div>
  );
};

export default Slideshow;
