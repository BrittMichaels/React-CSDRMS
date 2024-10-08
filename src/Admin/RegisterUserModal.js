import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styles from './RegisterUserModal.module.css';
import formStyles from '../GlobalForm.module.css';

const RegisterUserModal = ({ isOpen, onClose, role }) => {
    const [userData, setUserData] = useState({
        uid: '',
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        grade: '',
        section: '',
        schoolYear: '',
        userType: 1 // Default to SSO
    });
    const [grades, setGrades] = useState([]);
    const [sections, setSections] = useState([]);
    const [schoolYears, setSchoolYears] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setError('');

            // Fetch grade, section, and school year for Adviser role only
            if (role === 'Adviser') {
                axios.get('http://localhost:8080/class/allUniqueGrades')
                    .then(response => {
                        setGrades(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching grades:', error);
                    });

                axios.get('http://localhost:8080/schoolYear/getAllSchoolYears')
                    .then(response => {
                        setSchoolYears(response.data.map(year => year.schoolYear));
                    })
                    .catch(error => {
                        console.error('Error fetching school years:', error);
                    });
            }

            // Set userType based on role
            setUserData(prevUserData => ({
                ...prevUserData,
                userType: role === 'Principal' ? 2 
                          : role === 'Adviser' ? 3 
                          : role === 'Teacher' ? 5 
                          : role === 'Guidance' ? 6 
                          : 1
            }));
        }
    }, [isOpen, role]);

    const handleGradeChange = (e) => {
        const grade = e.target.value;
        setUserData(prevUserData => ({ ...prevUserData, grade, section: '', schoolYear: '' }));
        axios.get(`http://localhost:8080/class/sections/${grade}`)
            .then(response => {
                setSections(response.data);
            })
            .catch(error => {
                console.error('Error fetching sections:', error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevUserData => ({ ...prevUserData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = role === 'Adviser' ? 'registerAdviser' 
                         : role === 'Principal' ? 'registerPrincipal' 
                         : role === 'Teacher' ? 'registerTeacher' 
                         : role === 'Guidance' ? 'registerGuidance' 
                         : 'registerSSO';
        try {
            const response = await axios.post(`http://localhost:8080/user/${endpoint}`, userData);
            console.log(response.data);
            alert(`${role} is successfully registered.`);
            setError('');
            setTimeout(() => {
                onClose();
                window.location.reload(); // Refresh the page
            }, 200);
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.message;
                if (errorMessage.includes("query did not return a unique result: 2")) {
                    alert(`${role} with the same school year, grade, and section already exists.`);
                } else if (errorMessage.includes("Username already exists")) {
                    alert("Username already exists. Please try again.");
                } else {
                    alert("This section is already assigned to another adviser.");
                }
            } else {
                setError('An unexpected error occurred.');
            }
            setMessage('');
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-content']} onClick={e => e.stopPropagation()}>
                <button className={styles['modal-close-button']} onClick={onClose}>X</button>
                <h2>Register {role}</h2>
                <form onSubmit={handleSubmit} className={formStyles['form-container']}>
                    {message && <p className={formStyles.success}>{message}</p>}
                    {error && <p className={formStyles.error}>{error}</p>}
                    <div className={formStyles['form-group']}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                        />
                    </div>
                    <div className={formStyles['form-group']}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className={formStyles['form-group']}>
                        <label htmlFor="firstname">First Name:</label>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={userData.firstname}
                            onChange={handleChange}
                            placeholder="First Name"
                            required
                        />
                    </div>
                    <div className={formStyles['form-group']}>
                        <label htmlFor="lastname">Last Name:</label>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={userData.lastname}
                            onChange={handleChange}
                            placeholder="Last Name"
                            required
                        />
                    </div>
                    <div className={formStyles['form-group']}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                    </div>
                    {role === 'Adviser' && (
                        <>
                            <div className={formStyles['form-group']}>
                                <label htmlFor="grade">Grade:</label>
                                <select
                                    id="grade"
                                    name="grade"
                                    value={userData.grade}
                                    onChange={handleGradeChange}
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    {grades.map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={formStyles['form-group']}>
                                <label htmlFor="section">Section:</label>
                                <select
                                    id="section"
                                    name="section"
                                    value={userData.section}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Section</option>
                                    {sections.map(section => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={formStyles['form-group']}>
                                <label htmlFor="schoolYear">School Year:</label>
                                <select
                                    id="schoolYear"
                                    name="schoolYear"
                                    value={userData.schoolYear}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select School Year</option>
                                    {schoolYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </form>
                <div className={formStyles['global-buttonGroup']}>
                    <button type="submit" className={formStyles['global-button']}>Register</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RegisterUserModal;
