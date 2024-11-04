// ViewReportModal.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import styles from './ViewReport.module.css'; // New styles for modal
import modalStyles from './ReportModal.module.css'; // Generic modal styles
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ViewReportModal = ({ reportId, onClose }) => {
  const [report, setReport] = useState(null);
  const [suspension, setSuspension] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suspensionLoading, setSuspensionLoading] = useState(true);
  const exportRef = useRef();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/report/getReport/${reportId}`);
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report:', error);
        setLoading(false);
      }
    };

    const fetchSuspension = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/suspension/getSuspensionByReport/${reportId}`);
        setSuspension(response.data);
        setSuspensionLoading(false);
      } catch (error) {
        console.error('Error fetching suspension:', error);
        setSuspensionLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
      fetchSuspension();
    }
  }, [reportId]);

  const handleExportToPDF = async () => {
    const element = exportRef.current;

    // Capture the element as an image using html2canvas
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    // Create jsPDF document with long bond paper size
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [216, 330], // Long bond paper size in mm
    });

    // Define margins and calculate content dimensions
    const marginTop = 20; // Top margin in mm
    const marginLeft = 10; // Left margin in mm
    const pdfWidth = 216 - 2 * marginLeft; // Width adjusted for margins
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width; // Maintain aspect ratio

    // Add title and custom header (optional)
    pdf.setFontSize(16);
    pdf.text('Student Comprehensive Report', marginLeft, marginTop - 10);

    // Add the image content with margins
    pdf.addImage(imgData, 'PNG', marginLeft, marginTop, pdfWidth, pdfHeight);

    // Optional footer
    pdf.setFontSize(10);
    pdf.text('Generated on: ' + new Date().toLocaleDateString(), marginLeft, 330 - 10); // Bottom left corner

    // Save the PDF
    pdf.save('student-report.pdf');
};

  if (loading) {
    return <div class="dot-spinner">
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
      <div class="dot-spinner__dot"></div>
    </div>
  }

  if (!report) {
    return <p>Report not found.</p>;
  }

  return (
    <div className={modalStyles['report-modal-overlay']}>
      <div className={modalStyles['report-view-modal-content']}>
      <button className={modalStyles.closeButton} onClick={onClose}>✕</button>
      <button 
                           
                           onClick={handleExportToPDF}>
                           Export to PDF
                       </button>
      <div ref={exportRef} className={styles.exportSection}>
        
        <div className={styles.tablesContainer}>
       
          <div className={styles.tableWrapper}>
         
            
            <h2>Report Details</h2>
            <table className={styles['report-details']}>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Student:</td>
                  <td>{report.record.student.name}</td>
                </tr>
                <tr>
                  <td>Adviser:</td>
                  <td>{report.adviser.firstname} {report.adviser.lastname}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td>{report.date}</td>
                </tr>
                <tr>
                  <td>Time:</td>
                  <td>{report.time}</td>
                </tr>
                <tr>
                  <td>Received:</td>
                  <td>{report.received ? report.received : 'Pending'}</td>
                </tr>
                <tr>
                  <td>Complaint:</td>
                  <td>{report.complaint}</td>
                </tr>
                <tr>
                  <td>Complainant:</td>
                  <td>
                    {report.userComplainant.firstname} {report.userComplainant.lastname}
                  </td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{report.complete ? 'Complete' : 'Incomplete'}</td>
                </tr>
                {/* <tr>
                  <td>Viewed by Adviser:</td>
                  <td>{report.viewedByAdviser ? 'Yes' : 'No'}</td>
                </tr>
                <tr>
                  <td>Viewed by SSO:</td>
                  <td>{report.viewedBySso ? 'Yes' : 'No'}</td>
                </tr> */}
              </tbody>
            </table>
            
          </div>
  
          {/* Display Suspension Details Table */}
          <div className={styles['tableWrapper-second']}>
            <h2>Suspension Details</h2>
            {suspensionLoading ? (
              <p>Loading suspension details...</p>
            ) : suspension ? (
              <table className={styles['suspension-details-table']}>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Date Submitted:</td>
                    <td>{suspension.dateSubmitted}</td>
                  </tr>
                  <tr>
                    <td>Days Suspended:</td>
                    <td>{suspension.days}</td>
                  </tr>
                  <tr>
                    <td>Start Date:</td>
                    <td>{suspension.startDate}</td>
                  </tr>
                  <tr>
                    <td>End Date:</td>
                    <td>{suspension.endDate}</td>
                  </tr>
                  <tr>
                    <td>Return Date:</td>
                    <td>{suspension.returnDate}</td>
                  </tr>
                  {/* <tr>
                    <td>Viewed by Principal:</td>
                    <td>{suspension.viewedByPrincipal ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Viewed by Adviser:</td>
                    <td>{suspension.viewedByAdviser ? 'Yes' : 'No'}</td>
                  </tr>
                  <tr>
                    <td>Viewed by SSO:</td>
                    <td>{suspension.viewedBySso ? 'Yes' : 'No'}</td>
                  </tr> */}
                </tbody>
              </table>
            ) : (
              <p>No suspension details found for this report.</p>
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportModal;
