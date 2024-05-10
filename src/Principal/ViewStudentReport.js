import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from '../Navigation.module.css';
import styles2 from './ViewStudentReport.module.css';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';


const createSidebarLink = (to, text, IconComponent) => (
    <Link to={to} className={styles['styled-link']}>
        <IconComponent className={styles.icon} /> {/* Icon */}
        <span className={styles['link-text']}>{text}</span> {/* Text */}
    </Link>
);


const ViewStudentReport = () => {
    const { sid } = useParams();
    const [student, setStudent] = useState(null);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/getStudent/${sid}`);
                const data = await response.json();
                setStudent(data);
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        };

        const fetchReports = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student-report/getStudentReports/${sid}`);
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchStudent();
        fetchReports();
    }, [sid]);

    return (
        <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
            <div className={styles.sidenav}>
                <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']}/>
                {createSidebarLink("/student", "Student", SchoolIcon)}
                {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                {createSidebarLink("/report", "Report", AssessmentIcon)}
            </div>
            <div>
                <h2>Student Details</h2>
                {student && (
                    <div className={styles['student-details']}>
                        <p><strong>Name:</strong> {student.firstname} {student.middlename} {student.lastname}</p>
                        <p><strong>Grade:</strong> {student.grade}</p>
                        <p><strong>Section:</strong> {student.section}</p>
                        <p><strong>Contact Number:</strong> {student.con_num}</p>
                    </div>
                )}

                <h2>Student Reports</h2>
                <div className={styles['add-report-button']}>
                    <Link to={`/add-report/${sid}`}>
                        <button>Add Report</button>
                    </Link>
                </div>
                <table className={styles['reports-table']}>
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Name</th>
                            <th>Monitored Record</th>
                            <th>Remarks</th>
                            <th>Sanction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.rid}>
                                <td>{report.rid}</td>
                                <td>{report.date}</td>
                                <td>{report.time}</td>
                                <td>{report.name}</td>
                                <td>{report.monitored_record}</td>
                                <td>{report.remarks}</td>
                                <td>{report.sanction}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewStudentReport;