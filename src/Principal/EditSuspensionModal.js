import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../ReportModal.module.css'; // Correctly importing the styles
import formStyles from '../GlobalForm.module.css';

const EditSuspensionModal = ({ isOpen, onClose, suspension }) => {
  // States to hold edited suspension data
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);
  const [startDate, setStartDate] = useState(suspension.startDate);
  const [endDate, setEndDate] = useState(suspension.endDate);
  const [returnDate, setReturnDate] = useState(suspension.returnDate);
  const [days, setDays] = useState(suspension.days);
  const [offense, setOffense] = useState(suspension.offense);
  const [error, setError] = useState(null);


  useEffect(() => {
    setStartDate(suspension.startDate);
    setEndDate(suspension.endDate);
    setReturnDate(suspension.returnDate);
    setDays(suspension.days);
    setOffense(suspension.offense);
  }, [suspension]);
 

  // Function to handle saving edited suspension data
  const handleSave = async () => {
    try {
      const updatedSuspension = {
        ...suspension,
        startDate,
        endDate,
        returnDate,
        days,
        offense,
      };

      await axios.put(`http://localhost:8080/suspension/update/${suspension.suspensionId}/${loggedInUser.userId}`, updatedSuspension);
      window.location.reload();
      onClose(); // Close modal after save
    } catch (error) {
      console.error("Error updating suspension:", error);
      setError("Failed to update suspension. Please try again later.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles['report-modal-overlay']}>
      <div className={styles['suspension-modal-content']}>
        <h2>Edit Suspension</h2>
        {error && <p className={styles["error-message"]}>{error}</p>}
  
        <div className={styles['report-group']}>
          <label>Days of Suspension:</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className={styles['suspension-input']}
            />
        </div>
  
        <div className={styles['report-group']}>
          <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles['suspension-input']}
            />
        </div>
  
        <div className={styles['report-group']}>
          <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles['suspension-input']}
            /> 
        </div>
  
        <div className={styles['report-group']}>
          <label>Return Date:</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={styles['suspension-input']}
            />
        </div>
  
        <div className={styles['report-group']}>
          <label>Offense:</label>
            <textarea
              type="text"
              name="offense"
              value={offense}
              onChange={(e) => setOffense(e.target.value)}
              className={styles['complaint-textarea']}
            />
        </div>
  
        <div className={formStyles['global-buttonGroup']}>
          <button onClick={handleSave} className={formStyles['green-button']}>
            Save
          </button>
          <button onClick={onClose} className={`${formStyles['green-button']} ${formStyles['red-button']}`}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSuspensionModal;
