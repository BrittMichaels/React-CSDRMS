import React, { useState, useEffect } from 'react';
import axios from 'axios';

import styles from './AddRecordModal.module.css';
import formStyles from '../GlobalForm.module.css';

const AddRecordModal = ({ student, onClose, refreshRecords }) => {
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);
  const [period, setPeriod] = useState(''); // New state for period


  // Form state
  const [recordDate, setRecordDate] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [time, setTime] = useState('');
  const [monitoredRecord, setMonitoredRecord] = useState('');
  const [complainant, setComplainant] = useState(`${loggedInUser.firstname} ${loggedInUser.lastname}`);
  const [complaint, setComplaint] = useState('');
  const [remarks, setRemarks] = useState('');
  const [source, setSource] = useState(''); // Initialize as null for "Select"
  const [complete, setComplete] = useState('');

  // State for dynamic student selection
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const monitoredRecordsList = [
    'Absent',
    'Tardy',
    'Cutting Classes',
    'Improper Uniform',
    'Offense',
    'Misbehavior',
    'Clinic',
    ...(source !== 2 ? ['Lost/Found Items', 'Request ID', 'Request Permit'] : []),
    'TBD',
  ];

  // Fetch students on component mount
  useEffect(() => {
    if (loggedInUser.userType !== 1) {
      setSource(2); // Automatically select 'Complaint' if userType is not 3
    }
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/student/getAllCurrentStudents');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
    if (loggedInUser.userType !== 1) {
      setComplete(0); // Assuming '0' means incomplete or pending
    }
  }, []);

  const handleSubmit = async () => {
    if (!student && !selectedStudent) {
      alert('Please select a student before submitting.');
      return;
    }
    
    if (!recordDate || !incidentDate || !monitoredRecord || !source || (source === 1 && !period)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Explicitly set remarks to null if it's an empty string
    const finalRemarks = remarks === "" ? null : remarks;

    const finalComplete = source === 1 ? 2 : complete; 

    const newRecord = {
      id: student?.id || selectedStudent?.id,
      userId: loggedInUser.userId,
      name: student?.name || selectedStudent?.name,
      record_date: recordDate,
      incident_date: incidentDate,
      time: time,
      monitored_record: monitoredRecord,  
      encoder: `${loggedInUser.firstname} ${loggedInUser.lastname}`,
      source: source,
      complete: finalComplete,
    };

    if (source === 1) {
      newRecord.period = period;
      newRecord.remarks= finalRemarks;
    } else if (source === 2) {
      // Properties for Complaint
      newRecord.complainant = complainant;
      newRecord.complaint = complaint;
    } 

    try {
      await axios.post(`http://localhost:8080/record/insert/${loggedInUser.userId}`, newRecord);
      alert('Record added successfully');
      refreshRecords();
      onClose();
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Record with the same student, record date, period, and monitored record already exists.');
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the student selection
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(`${student.sid} - ${student.name}`); // Set search query to selected student's name
  };

  // Handle removing selected student
  const handleRemoveStudent = () => {
    setSelectedStudent(null);
    setSearchQuery(''); // Clear the search query when removing student
  };

  return (
    <div className={styles['student-modal-overlay']}>
      <div className={styles['student-add-modal-content']}>
        <h2>Add New Record</h2>

        <div className={formStyles['form-container']}>
          <div className={formStyles['form-group']}>
            <label>Source</label>
            <select
              value={source || ''}
              onChange={(e) => setSource(Number(e.target.value))} // Convert the value to integer
              className={`${formStyles['input']} ${styles['student-modal-select']}`}
              disabled={loggedInUser.userType !== 1}
            >
              <option value="">Select Source</option> 
              <option value="1">Log Book</option>
              <option value="2">Complaint</option>
              <option value="0">N/A</option>
            </select>
          </div>
          
          {!student && (
            <>
              <div className={formStyles['form-group']}>
                <label>Search Student:</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={formStyles['input']}
                  placeholder="Type to search student by name"
                  disabled={selectedStudent}
                />

                {selectedStudent && (
                  <button className={styles.clearButton} onClick={handleRemoveStudent}>
                    ✕
                  </button>
                )}
              </div>

              {!selectedStudent && (
                <div>
                  {searchQuery && filteredStudents.length > 0 ? (
                    <ul className={styles.dropdown}>
                      {filteredStudents.map((student) => (
                        <li key={student.id}
                            onClick={() => handleSelectStudent(student)}
                            className={styles.dropdownItem}>
                          {student.name} ({student.sid})
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery && filteredStudents.length === 0 ? (
                    <div className={styles.dropdown}>No students found.</div>
                  ) : null }
                </div>
              )}
            </>
          )}

          <div className={formStyles['form-group']}>
            <label>Record Date:</label>
            <input
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className={formStyles['input']}
            />
          </div>

          <div className={formStyles['form-group']}>
            <label>Incident Date:</label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className={formStyles['input']}
            />
          </div>

          <div className={formStyles['form-group']}>
            <label>Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={formStyles['input']}
            />
          </div>

          <div className={formStyles['form-group']}>
            <label>Monitored Record:</label>
            <select
              value={monitoredRecord}
              onChange={(e) => setMonitoredRecord(e.target.value)}
              className={`${formStyles['input']} ${styles['student-modal-select']}`}
            >
              <option value="">Select Record Type</option>
              {monitoredRecordsList.map((record) => (
                <option key={record} value={record}>
                  {record}
                </option>
              ))}
            </select>
          </div>
          {source === 1 && (
            <div className={formStyles['form-group']}>
              <label>Period:</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className={formStyles['input']}
              >
                <option value="">Select Period</option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show Complainant and Complaint if source is Complaint */}
          {source === 2 ? (
            <>
              <div className={formStyles['form-group']}>
                <label>Complainant:</label>
                <input
                  type="text"
                  value={complainant}
                  onChange={(e) => setComplainant(e.target.value)}
                  className={formStyles['input']}
                />
              </div>
              <div className={formStyles['form-group']}>
                <label>Complaint:</label>
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className={formStyles['form-group-textarea']}
                />
              </div>
            </>
          ) : (
            // Show Remarks if source is not Complaint
            <div className={formStyles['form-group']}>
              <label>Remarks:</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className={formStyles['form-group-textarea']}
              />
            </div>
          )}

          <div className={formStyles['global-buttonGroup']}>
            <button className={formStyles['green-button']} onClick={handleSubmit}>
              Submit
            </button>
            <button
              className={`${formStyles['green-button']} ${formStyles['red-button']}`}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecordModal;
