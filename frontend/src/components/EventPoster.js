import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './EventPoster.module.css';


const EventPoster = () => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
    noClick: true, // Prevent default click behavior
    noKeyboard: true,
  });

  const dropAreaStyle = {
    width: '100%',
    height: '300px',
    border: '2px dashed #ccc',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    transition: 'background-color 0.3s',
    backgroundColor: isDragging ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
  };

  const placeholderStyle = {
    textAlign: 'center',
    color: '#555',
    fontSize: '18px',
  };

  const posterImageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '10px',
  };

  return (
    <div className={{ width: '100%', maxWidth: '500px', margin: '20px auto', position: 'relative' }}>
      <div
        {...getRootProps()}
        className={dropAreaStyle}
      >
        <input
          {...getInputProps()}
          id="fileInput"
          className={{ display: 'none' }}
          type="file"
          accept="image/*"
        />
        {image ? (
          <img src={image} alt="Event Poster" className={posterImageStyle} />
        ) : (
          <div className={placeholderStyle}>
            <p>Drop here or browse to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

const UploadButton = () => {
  // Trigger the file input on button click
  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className={styles.formGroup}>
      <label>Event Poster:</label>
      <button onClick={handleClick} className={styles.input}>Upload</button>
    </div>
  );
};

export default function App() {
  return (
    <div>
      <UploadButton />
      <EventPoster />
    </div>
  );
}
