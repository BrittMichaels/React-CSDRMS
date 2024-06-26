import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import studentStyles from './Student.module.css';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';

const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} />
        <span className={styles['link-text']}>{text}</span>
    </Link>
);

const AdviserStudent = () => {
    const authToken = localStorage.getItem('authToken');
    const loggedInUser = JSON.parse(authToken);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Student";

        if (loggedInUser) {
            const url = loggedInUser.userType === 3
                ? `http://localhost:8080/student/getAllStudents/${loggedInUser.schoolYear}/${loggedInUser.section}`
                : 'http://localhost:8080/student/getAllStudents';

            fetch(url)
                .then(response => response.json())
                .then(data => setStudents(data))
                .catch(error => console.error('Error fetching students:', error));
        } else {
            console.error('Logged-in user details are missing.');
        }
    }, [loggedInUser]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleDelete = (sid) => {
        fetch(`http://localhost:8080/student/deleteStudent/${sid}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    setStudents(prevStudents => prevStudents.filter(student => student.sid !== sid));
                } else {
                    console.error('Failed to delete student');
                }
            })
            .catch(error => console.error('Error deleting student:', error));
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
    };

    const filteredStudents = useMemo(() => students.filter(student =>
        student.sid.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastname.toLowerCase().includes(searchQuery.toLowerCase())
    ), [students, searchQuery]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                {createSidebarLink("/report", "Report", AssessmentIcon)}
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {loggedInUser.userType !== 1 && createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {loggedInUser.userType !== 2 && (
                    <>
                        {loggedInUser.userType === 3 
                            ? createSidebarLink("/adviserCase", "Case", PostAddIcon)
                            : createSidebarLink("/case", "Case", PostAddIcon)
                        }
                    </>
                )}
                {loggedInUser.userType !== 1 && loggedInUser.userType !== 2 && createSidebarLink("/Followup", "Followups", PendingActionsIcon)}
                <button className={styles.logoutbtn} onClick={handleLogout}>Logout</button>
            </div>
            <div className={styles.content}>
                <div className={studentStyles['student-content']}>
                    <h2>Students</h2>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by SID, First Name, or Last Name"
                    />
                    {loggedInUser.userType === 3 && (
                        <Link to="/add-student">
                            <button>Add Student</button>
                        </Link>
                    )}
                    <table className={studentStyles['student-table']}>
                        <thead>
                            <tr>
                                <th>SID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Grade</th>
                                <th>Section</th>
                                <th>Contact No.</th>
                                {loggedInUser.userType === 3 && <th>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr 
                                    key={student.sid} 
                                    onClick={() => handleSelectStudent(student)}
                                    className={selectedStudent?.sid === student.sid ? studentStyles['selected-row'] : ''}
                                >
                                    <td>{student.sid}</td>
                                    <td>{student.firstname}</td>
                                    <td>{student.middlename}</td>
                                    <td>{student.lastname}</td>
                                    <td>{student.grade}</td>
                                    <td>{student.section}</td>
                                    <td>{student.con_num}</td>
                                    {loggedInUser.userType === 3 && (
                                        <td>
                                            <Link to={`/update-student/${student.sid}`}>
                                                <EditIcon className={`${studentStyles['icon-button']} ${studentStyles['icon-edit']}`} />
                                            </Link>
                                            <DeleteIcon className={`${studentStyles['icon-button']} ${studentStyles['icon-delete']}`} onClick={() => handleDelete(student.sid)} />
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedStudent && (
                        <div className={studentStyles['report-buttons']}>
                            <Link to={`/add-report/${selectedStudent.sid}`}>
                                <button>Add Report</button>
                            </Link>
                            <Link to={`/view-student-report/${selectedStudent.sid}`}>
                                <button>View Report</button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdviserStudent;
