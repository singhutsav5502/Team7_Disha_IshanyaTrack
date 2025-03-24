import React, { useState, useEffect } from 'react';
import { fetchStudents, fetchEmployees } from '../api/apiService';
import './BroadcastPage.css';

const BroadcastPage = () => {
  // State for app notifications
  const [appNotification, setAppNotification] = useState({
    title: '',
    body: '',
    selectedStudents: [],
  });

  // State for email broadcasts
  const [emailBroadcast, setEmailBroadcast] = useState({
    subject: '',
    body: '',
    sendToStudentParents: false,
    sendToEmployees: false,
  });

  // State for students and employees data
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch students and employees on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const studentsData = await fetchStudents();
        const employeesData = await fetchEmployees();
        setStudents(studentsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setMessage({ text: 'Failed to load data', type: 'error' });
      }
    };
    
    loadData();
  }, []);

  // Handle app notification changes
  const handleAppNotificationChange = (e) => {
    const { name, value } = e.target;
    setAppNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle email broadcast changes
  const handleEmailBroadcastChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailBroadcast(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle student selection for app notifications
  const handleStudentSelection = (studentId) => {
    setAppNotification(prev => {
      const isSelected = prev.selectedStudents.includes(studentId);
      
      if (isSelected) {
        return {
          ...prev,
          selectedStudents: prev.selectedStudents.filter(id => id !== studentId)
        };
      } else {
        return {
          ...prev,
          selectedStudents: [...prev.selectedStudents, studentId]
        };
      }
    });
  };

  // Handle select all students
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    
    if (!selectAll) {
      // Select all students
      setAppNotification(prev => ({
        ...prev,
        selectedStudents: students.map(student => student.S_ID)
      }));
    } else {
      // Deselect all students
      setAppNotification(prev => ({
        ...prev,
        selectedStudents: []
      }));
    }
  };

  // Send app notifications
  const sendAppNotifications = async () => {
    if (!appNotification.title || !appNotification.body) {
      setMessage({ text: 'Please provide both title and body for the notification', type: 'error' });
      return;
    }

    if (appNotification.selectedStudents.length === 0) {
      setMessage({ text: 'Please select at least one student', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      // Send notifications to all selected students
      const promises = appNotification.selectedStudents.map(studentId => 
        fetch(`https://team7.pythonanywhere.com/notify/${studentId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: appNotification.title,
            body: appNotification.body
          })
        }).then(res => {
          if (!res.ok) throw new Error(`Failed to notify student ${studentId}`);
          return res.json();
        })
      );

      await Promise.all(promises);
      setMessage({ text: 'App notifications sent successfully!', type: 'success' });
      
      // Reset form
      setAppNotification({
        title: '',
        body: '',
        selectedStudents: []
      });
      setSelectAll(false);
    } catch (error) {
      console.error('Error sending app notifications:', error);
      setMessage({ text: 'Failed to send app notifications', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Send email broadcasts
  const sendEmailBroadcast = async () => {
    if (!emailBroadcast.subject || !emailBroadcast.body) {
      setMessage({ text: 'Please provide both subject and body for the email', type: 'error' });
      return;
    }

    if (!emailBroadcast.sendToStudentParents && !emailBroadcast.sendToEmployees) {
      setMessage({ text: 'Please select at least one recipient group', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://team7.pythonanywhere.com/send-email-broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject: emailBroadcast.subject,
          body: emailBroadcast.body,
          sendToStudentParents: emailBroadcast.sendToStudentParents,
          sendToEmployees: emailBroadcast.sendToEmployees
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email broadcast');
      }

      const result = await response.json();
      setMessage({ text: 'Email broadcast sent successfully!', type: 'success' });
      
      // Reset form
      setEmailBroadcast({
        subject: '',
        body: '',
        sendToStudentParents: false,
        sendToEmployees: false
      });
    } catch (error) {
      console.error('Error sending email broadcast:', error);
      setMessage({ text: 'Failed to send email broadcast', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="broadcast-page">
      <h1>Broadcast Center</h1>
      
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}
      
      <div className="broadcast-sections">
        {/* App Notification Section */}
        <div className="broadcast-section">
          <h2>App Notifications</h2>
          <div className="form-group">
            <label htmlFor="app-title">Notification Title</label>
            <input
              type="text"
              id="app-title"
              name="title"
              value={appNotification.title}
              onChange={handleAppNotificationChange}
              placeholder="Enter notification title"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="app-body">Notification Body</label>
            <textarea
              id="app-body"
              name="body"
              value={appNotification.body}
              onChange={handleAppNotificationChange}
              placeholder="Enter notification content"
              rows={4 as number}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Select Recipients</label>
            <div className="select-all-container">
              <input
                type="checkbox"
                id="select-all"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label htmlFor="select-all">Select All Students</label>
            </div>
            
            <div className="students-list">
              {students.map(student => (
                <div key={student.S_ID} className="student-item">
                  <input
                    type="checkbox"
                    id={`student-${student.S_ID}`}
                    checked={appNotification.selectedStudents.includes(student.S_ID)}
                    onChange={() => handleStudentSelection(student.S_ID)}
                  />
                  <label htmlFor={`student-${student.S_ID}`}>
                    {student.Fname} {student.Lname} ({student.S_ID})
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="send-button" 
            onClick={sendAppNotifications}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send App Notifications'}
          </button>
        </div>
        
        {/* Email Broadcast Section */}
        <div className="broadcast-section">
          <h2>Email Broadcast</h2>
          <div className="form-group">
            <label htmlFor="email-subject">Email Subject</label>
            <input
              type="text"
              id="email-subject"
              name="subject"
              value={emailBroadcast.subject}
              onChange={handleEmailBroadcastChange}
              placeholder="Enter email subject"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email-body">Email Body</label>
            <textarea
              id="email-body"
              name="body"
              value={emailBroadcast.body}
              onChange={handleEmailBroadcastChange}
              placeholder="Enter email content"
              rows={4 as number}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Select Recipients</label>
            <div className="recipient-options">
              <div className="recipient-option">
                <input
                  type="checkbox"
                  id="student-parents"
                  name="sendToStudentParents"
                  checked={emailBroadcast.sendToStudentParents}
                  onChange={handleEmailBroadcastChange}
                />
                <label htmlFor="student-parents">All Student Parents</label>
              </div>
              
              <div className="recipient-option">
                <input
                  type="checkbox"
                  id="employees"
                  name="sendToEmployees"
                  checked={emailBroadcast.sendToEmployees}
                  onChange={handleEmailBroadcastChange}
                />
                <label htmlFor="employees">All Employees</label>
              </div>
            </div>
          </div>
          
          <button 
            className="send-button" 
            onClick={sendEmailBroadcast}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email Broadcast'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastPage;
