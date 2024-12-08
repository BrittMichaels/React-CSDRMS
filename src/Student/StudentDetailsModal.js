import React from 'react';
import styles from './StudentDetailsModal.module.css'; // Create this CSS module for styling
import CloseIcon from '@mui/icons-material/Close';

const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
            <h3>Student Details</h3>
            <button onClick={onClose} className={styles['closeIcon']}>
            ✕
            </button>
        </div>
        <div className={styles.modalBody}>
          <p><strong>ID Number:</strong> {student.sid || 'N/A'}</p>
          <p><strong>Name:</strong> {student.name || 'N/A'}</p>
          <p><strong>Grade:</strong> {student.grade || 'N/A'}</p>
          <p><strong>Section:</strong> {student.section || 'N/A'}</p>
          <p><strong>Adviser:</strong> {student.adviser || 'N/A'}</p>
          <p><strong>Gender:</strong> {student.gender || 'N/A'}</p>
          <p><strong>Email Address:</strong> {student.email || 'N/A'}</p>
          <p><strong>Home Address:</strong> {student.homeAddress || 'N/A'}</p>
          <p><strong>Emergency No.:</strong> {student.emergencyNumber || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
