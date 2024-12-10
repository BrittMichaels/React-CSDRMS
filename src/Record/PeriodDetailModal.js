import React, { useState, useEffect } from 'react';
import styles from './PeriodDetailModal.module.css';
import buttonStyles from '../GlobalButton.module.css';

const options = [
  'Absent',
  'Tardy',
  'Cutting Classes',
  'Improper Uniform',
];

const PeriodDetailModal = ({ student, period, initialRecord, initialRemarks, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [remarks, setRemarks] = useState('');

  // On mount or when initial values change, load data
  useEffect(() => {
    // If no initial values are provided, attempt to load from localStorage
    if ((!initialRecord || initialRecord.length === 0) && (!initialRemarks || initialRemarks === '')) {
      const key = `record-${student.id}-${period}`;
      const storedData = JSON.parse(localStorage.getItem('logBookData')) || {};
      if (storedData[key]) {
        setSelectedOptions(storedData[key].record || []);
        setRemarks(storedData[key].remarks || '');
      }
    } else {
      // Use the passed-in initial values
      setSelectedOptions(initialRecord || []);
      setRemarks(initialRemarks || '');
    }
  }, [initialRecord, initialRemarks, student.id, period]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    // Save current selections into localStorage before closing
    const key = `record-${student.id}-${period}`;
    const storedData = JSON.parse(localStorage.getItem('logBookData')) || {};

    storedData[key] = {
      record: selectedOptions,
      remarks: remarks
    };

    localStorage.setItem('logBookData', JSON.stringify(storedData));

    // Notify parent of changes
    onClose(selectedOptions, remarks);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 style={{color: '#8A252C'}}>Period {period} - {student.name}</h3>
        <div className={styles.checkboxContainer}>
          {options.map((option) => (
            <label key={option} className={styles.checkboxItem}>
              <input 
                type="checkbox" 
                checked={selectedOptions.includes(option)} 
                onChange={() => handleCheckboxChange(option)} 
              />
              {option}
            </label>
          ))}
        </div>

        {/* Remarks Input */}
        <div className={styles.remarksContainer}>
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter remarks here"
          />
        </div>

        <div className={buttonStyles['button-group']}>
          <button onClick={handleSubmit} className={`${buttonStyles['action-button']} ${buttonStyles['green-button']}`}>
            Submit
          </button>
          <button onClick={() => onClose(null)} className={`${buttonStyles['action-button']} ${buttonStyles['red-button']}`}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodDetailModal;
