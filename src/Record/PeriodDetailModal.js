import React, { useState } from 'react';
import styles from './PeriodDetailModal.module.css';
import buttonStyles from '../GlobalButton.module.css';

const options = [
  'Absent',
  'Tardy',
  'Cutting Classes',
  'Improper Uniform',
];

const PeriodDetailModal = ({ student, period, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [remarks, setRemarks] = useState(''); // Add state for remarks

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    onClose(selectedOptions, remarks); // Pass selected options and remarks
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
          <button onClick={handleSubmit} className={`${buttonStyles['action-button']} ${buttonStyles['green-button']}`}>Submit</button>
          <button onClick={() => onClose(null)} className={`${buttonStyles['action-button']} ${buttonStyles['red-button']}`}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PeriodDetailModal;
