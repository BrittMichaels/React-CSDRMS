import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AddLogBookModal.module.css'; 
import formStyles from '../GlobalForm.module.css';
import buttonStyles from '../GlobalButton.module.css'

import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeriodDetailModal from './PeriodDetailModal'; 

const AddLogBookModal = ({ isOpen, onClose, records }) => {
  const [students, setStudents] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [studentsPerPage] = useState(10); 
  const [schoolYears, setSchoolYears] = useState([]); 
  const [grades, setGrades] = useState([]); 
  const [sections, setSections] = useState([]); 
  const [selectedSchoolYear, setSelectedSchoolYear] = useState(''); 
  const [selectedGrade, setSelectedGrade] = useState(''); 
  const [selectedSection, setSelectedSection] = useState(''); 
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [monitoredRecords, setMonitoredRecords] = useState({}); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Added date state
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const authToken = localStorage.getItem('authToken');
  const loggedInUser = JSON.parse(authToken);


  // Fetch students, school years, grades, and sections on component mount
  useEffect(() => {
    fetchSchoolYears();
    fetchGrades();
  }, []);

  // Fetch students whenever a filter is changed
  useEffect(() => {
    if (selectedSchoolYear && selectedGrade && selectedSection) {
      fetchStudents();
    }
  }, [selectedSchoolYear, selectedGrade, selectedSection]);

  useEffect(() => {
    if (schoolYears.length > 0) {
      setSelectedSchoolYear(schoolYears[0].schoolYear);
    }
  }, [schoolYears]);

  useEffect(() => {
    if (grades.length > 0) {
      setSelectedGrade(grades[0]);
      fetchSections(grades[0]); 
    }
  }, [grades]);

  useEffect(() => {
    if (sections.length > 0) {
      setSelectedSection(sections[0]);
    }
  }, [sections]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/student/getAllCurrentStudents', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Filter students on the client side
      const filteredStudents = response.data.filter((student) => 
        (!selectedSchoolYear || student.schoolYear === selectedSchoolYear) &&
        (!selectedGrade || student.grade === parseInt(selectedGrade)) &&
        (!selectedSection || student.section.toUpperCase() === selectedSection.toUpperCase())
      );

      // Sort students by gender (MALE first, then FEMALE) and then by name (ascending)
      const sortedStudents = filteredStudents.sort((a, b) => {
        if (a.gender === b.gender) {
          return a.name.localeCompare(b.name);
        }
        return a.gender === 'MALE' ? -1 : 1;
      });

      setStudents(sortedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get('http://localhost:8080/schoolYear/getAllSchoolYears', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSchoolYears(response.data);
    } catch (error) {
      console.error('Error fetching school years:', error);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:8080/class/allUniqueGrades', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGrades(response.data);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const fetchSections = async (grade) => {
    try {
      const response = await axios.get(`http://localhost:8080/class/sections/${grade}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handlePeriodClick = (student, period) => {
    setSelectedStudent(student);
    setSelectedPeriod(period);
    setIsPeriodModalOpen(true);
  };

  const closePeriodModal = (selectedRecord) => {
    if (selectedRecord) {
      const key = `record-${selectedStudent.id}-${selectedPeriod}`;
      setMonitoredRecords((prevRecords) => ({
        ...prevRecords,
        [key]: selectedRecord,
      }));
    }
    setIsPeriodModalOpen(false);
    setSelectedStudent(null);
    setSelectedPeriod(null);
  };

  const currentPageStudents = students.slice(
    (currentPage - 1) * studentsPerPage, 
    currentPage * studentsPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSubmit = async () => {
    const payload = Object.entries(monitoredRecords).flatMap(([key, monitoredRecords]) => {
      const [_, studentId, period] = key.split('-');
      return monitoredRecords.map(monitored_record => ({
        id: parseInt(studentId),
        encoderId: loggedInUser.userId,
        record_date: selectedDate,  // Use selectedDate here
        incident_date: selectedDate,  // Use selectedDate here
        monitored_record,
        period: parseInt(period),
        source: 1, 
        complete: 0
      }));
    });

    try {
      await axios.post('http://localhost:8080/record/insertMultipleRecords', payload, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert('Records successfully saved!');
    } catch (error) {
      console.error('Error saving records:', error);
      alert('Failed to save records.');
    }
  };

  return (
    <div className={styles['logbook-modal-overlay']}>
      <div className={styles['logbook-modal-content']}>
        <h2 className={styles.modalTitle}>Add Log Book</h2>

        {/* Filter Section */}
        <div className={styles.filterContainer}>
            <label>School Year:
              <select value={selectedSchoolYear} onChange={(e) => setSelectedSchoolYear(e.target.value)}>
                {schoolYears.map((year) => (
                  <option key={year.schoolYear_ID} value={year.schoolYear}>
                    {year.schoolYear}
                  </option>
                ))}
              </select>
            </label>

            <label>Grade:
              <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </label>

            <label>Section:
              <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            {/* Date Picker Section */}
            <label>Record Date:
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </label>
        </div>

        <div className={styles['table-container']}>
          <table className={styles['logbook-table']}>
            <thead>
              <tr>
                <th style={{borderLeft: '0.5px solid #8A252C'}}>#</th>
                <th>Student Name</th>
                {[...Array(8).keys()].map(period => (
                  <th key={period + 1}>{period + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    No students available.
                  </td>
                </tr>
              ) : (
                currentPageStudents.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1 + (currentPage - 1) * studentsPerPage}</td>
                    <td>{student.name}</td>
                    {[...Array(8).keys()].map(period => (
                      <td
                        key={period + 1}
                        className={styles.clickableCell}
                        onClick={() => handlePeriodClick(student, period + 1)}
                      >
                        {monitoredRecords[`record-${student.id}-${period + 1}`] || (
                          <AddCircleIcon style={{ color: '#8A252C' }} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1 || students.length === 0}
            aria-label="Previous Page"
          >
            <ArrowBackIcon />
          </button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || students.length === 0}
            aria-label="Next Page"
          >
            <ArrowForwardIcon />
          </button>
        </div>

        <div className={buttonStyles['button-group']}>
          <button onClick={handleSubmit} className={`${formStyles.submitBtn} ${buttonStyles['action-button']} ${buttonStyles['green-button']}`}>
            Submit
          </button>

          <button onClick={onClose} className={`${buttonStyles['action-button']} ${buttonStyles['red-button']}`}>
            Cancel
          </button>
        </div>

        {/* Period Detail Modal */}
        {isPeriodModalOpen && (
          <PeriodDetailModal 
            student={selectedStudent} 
            period={selectedPeriod} 
            onClose={closePeriodModal} 
          />
        )}
      </div>
    </div>
  );
};

export default AddLogBookModal;
