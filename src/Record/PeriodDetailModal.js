import React, { useState } from 'react';
import styles from './PeriodDetailModal.module.css';

const options = [
  'Absent',
  'Tardy',
  'Cutting Classes',
  'Improper Uniform',
  'Offense',
  'Misbehavior',
];

const PeriodDetailModal = ({ student, period, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    onClose(selectedOptions); 
  };


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Period {period} - {student.name}</h3>
        {options.map((option) => (
          <div key={option}>
            <input 
              type="checkbox" 
              checked={selectedOptions.includes(option)} 
              onChange={() => handleCheckboxChange(option)} 
            />
            {option}
          </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={() => onClose(null)}>Close</button>
      </div>
    </div>
  );
};

export default PeriodDetailModal;
