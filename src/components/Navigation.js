import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import navStyles from './Navigation.module.css'; // CSS for Navigation
import NotificationModal from './NotificationModal'; // Import NotificationModal
import MenuPopupState from './MenuPopupState';
import Loader from '../Loader.js';

import JHSLogo from '../LoginPage/image-sso-yellow.png';

import SchoolIcon from '@mui/icons-material/School';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import IconButton from '@mui/material/IconButton';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTimeFilled';

const Navigation = ({ loggedInUser }) => {
  const { userId } = loggedInUser;
  const navigate = useNavigate();
  const location = useLocation(); // To get the current URL path

  const [unviewedCount, setUnviewedCount] = useState(0); // To store count of unviewed notifications
  const [notifications, setNotifications] = useState([]); // All notifications for display
  const [notificationToggle, setNotificationToggle] = useState(false);

  const INACTIVITY_TIME_LIMIT = 10 * 30 * 1000; // 5 minutes
  let inactivityTimer;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => handleLogout(), INACTIVITY_TIME_LIMIT);
  };

  const handleLogout = async () => {
    try {
      const logoutTime = new Date().toISOString();
      const response = await axios.get(`http://localhost:8080/time-log/getLatestLog/${userId}`);
      console.log('Response from API:', response.data);

      const { timelog_id: timelogId } = response.data;

      await axios.post('http://localhost:8080/time-log/logout', {
        timelogId,
        logoutTime,
      });

      localStorage.removeItem('authToken');
      sessionStorage.clear();
      navigate('/');
      alert('You have been logged out due to inactivity.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    <Loader />;
  };

  // Attach activity listeners
  useEffect(() => {
    const activityEvents = ['mousemove', 'keypress', 'mousedown', 'touchstart'];

    const setupActivityListeners = () => {
      activityEvents.forEach((event) => {
        window.addEventListener(event, resetInactivityTimer);
      });
    };

    const removeActivityListeners = () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };

    // Disable Ctrl+P (Print) event
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        alert('Printing is disabled.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Start inactivity timer and setup listeners
    resetInactivityTimer();
    setupActivityListeners();

    // Cleanup on component unmount
    return () => {
      clearTimeout(inactivityTimer);
      removeActivityListeners();
      window.removeEventListener('keydown', handleKeyDown); // Remove event listener on cleanup
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/user/${userId}`);
        const notificationsData = response.data;

        notificationsData.sort((a, b) => b.userNotificationId - a.userNotificationId);
        const unviewedNotifications = notificationsData.filter((notification) => !notification.viewed);

        setUnviewedCount(unviewedNotifications.length);
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleToggleNotification = () => {
    if (notificationToggle) setNotificationToggle(false);
    else setNotificationToggle(true);
  };

  const handleModalClose = () => {
    setNotificationToggle(false);
  };

  const createSidebarLink = (to, text, IconComponent) => {
    const isActive = location.pathname === to;

    const linkStyles = `${navStyles['styled-link']} ${isActive ? navStyles.active : ''}`;

    return (
      <Link to={to} className={linkStyles}>
        <IconComponent className={navStyles.icon} />
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <>
      {loggedInUser.userType !== 5 && (
        <div className={navStyles.sidenav}>
          <div className={navStyles['sidenav-title']}>MENU</div>
          {loggedInUser.userType === 1 && createSidebarLink('/dashboard', 'Dashboard', AssessmentIcon)}
          {loggedInUser.userType === 1 && createSidebarLink('/student', 'Student', SchoolIcon)}
          {loggedInUser.userType === 1 && createSidebarLink('/StudentList', 'Student List', AssignmentIcon)}
          {loggedInUser.userType === 1 && createSidebarLink('/record', 'Record', PostAddIcon)}
          {loggedInUser.userType === 1 && createSidebarLink('/suspension', 'Suspension', LocalPoliceIcon)}
          {loggedInUser.userType === 1 && createSidebarLink('/activitylog', 'Activity Log', AccessTimeIcon)}

          {loggedInUser.userType === 2 && createSidebarLink('/dashboard', 'Dashboard', AssessmentIcon)}
          {loggedInUser.userType === 2 && createSidebarLink('/suspension', 'Suspension', LocalPoliceIcon)}
          {loggedInUser.userType === 2 && createSidebarLink('/record', 'Complaint', PostAddIcon)}

          {loggedInUser.userType === 3 && createSidebarLink('/dashboard', 'Dashboard', AssessmentIcon)}
          {loggedInUser.userType === 3 && createSidebarLink('/student', 'Student', SchoolIcon)}
          {loggedInUser.userType === 3 && createSidebarLink('/StudentList', 'Student List', AssignmentIcon)}
          {loggedInUser.userType === 3 && createSidebarLink('/record', 'Record', PostAddIcon)}

          {loggedInUser.userType === 4 && createSidebarLink('/UserManagement', 'Users', AccountBoxIcon)}
          {loggedInUser.userType === 4 && createSidebarLink('/Class', 'Class', SchoolIcon)}
          {loggedInUser.userType === 4 && createSidebarLink('/StudentList', 'Student List', AssignmentIcon)}
          {loggedInUser.userType === 4 && createSidebarLink('/activitylog', 'Activity Log', AccessTimeIcon)}

          {loggedInUser.userType === 6 && createSidebarLink('/dashboard', 'Dashboard', AssessmentIcon)}
          {loggedInUser.userType === 6 && createSidebarLink('/student', 'Student', SchoolIcon)}
          {loggedInUser.userType === 6 && createSidebarLink('/record', 'Complaint', PostAddIcon)}
        </div>
      )}

      <header className={navStyles.header}>
        <div className={navStyles.JHSheaderContainer}>
          <img src={JHSLogo} alt="JHS Logo" className={navStyles.JHSLogo} />
          <span className={navStyles.JHSTitle}>JHS Success Hub</span>
        </div>

        <div className={navStyles['header-wrapper']}>
          {loggedInUser?.userType !== 4 && (
            <IconButton onClick={handleToggleNotification}>
              <NotificationsActiveIcon className={navStyles['header-icon']} />
              {unviewedCount > 0 && <span className={navStyles.badge}>{unviewedCount}</span>}
            </IconButton>
          )}
          <MenuPopupState />
        </div>
      </header>

      {notificationToggle && (
        <NotificationModal
          onClose={handleModalClose}
          notifications={notifications}
          loggedInUser={loggedInUser}
          setNotifications={setNotifications}
          refreshNotifications={() => setUnviewedCount(0)} 
        />
      )}
    </>
  );
};

export default Navigation;
