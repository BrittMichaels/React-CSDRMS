import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import styles from '../Navigation.module.css'; // Import CSS module

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Case = () => {    
    const navigate = useNavigate(); 
    const createSidebarLink = (to, text, IconComponent) => (
        <Link to={to} className={styles['styled-link']}>
            <IconComponent className={styles.icon} /> {/* Icon */}
            <span className={styles['link-text']}>{text}</span> {/* Text */}
        </Link>
    );

    const handleLogout = () => {
        // Clear the authentication token from localStorage
        localStorage.removeItem('authToken');
        // Redirect the user to the login page
        navigate('/');
    };

        return (
            <div className={styles.wrapper} style={{ backgroundImage: 'url(/public/image-2-3@2x.png)' }}>
                <div className={styles.sidenav}>
                    <img src="/image-removebg-preview (1).png" alt="" className={styles['sidebar-logo']} />
                    {createSidebarLink("/account", "Account", AccountBoxIcon)}
                    {createSidebarLink("/student", "Student", SchoolIcon)}
                    {createSidebarLink("/notification", "Notification", NotificationsActiveIcon)}
                    {createSidebarLink("/feedback", "Feedback", RateReviewIcon)}
                    {createSidebarLink("/case", "Case", PostAddIcon)}
                    {createSidebarLink("/pendings", "Pendings", PendingActionsIcon)}
                    {createSidebarLink("/sanctions", "Sanctions", LocalPoliceIcon)}
                    {createSidebarLink("/report", "Report", AssessmentIcon)}
                    <button className={styles['logoutbtn']} onClick={handleLogout}>Logout</button>
                </div>
                <div className={styles.content}>
                    <h1>case</h1>
                </div>
            </div>
        );
}

export default Case;
