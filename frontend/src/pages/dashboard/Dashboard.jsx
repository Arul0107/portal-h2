import React, { useEffect, useState } from 'react';
import { Divider } from 'antd';
import { UserOutlined, FileDoneOutlined, TeamOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import { useNavigate } from 'react-router-dom'; // For navigation
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import './Dashboard.css'; // Custom CSS for styling

const Dashboard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      // Parse the user data and set the state
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      console.log('User data:', parsedUser); // Check if employee_id is available
    } else {
      // If no user is found, show a toast message and navigate to login
      toast.error('Please log in to continue');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="main">
      <ToastContainer />
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <h1 className="header-title">
            {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'core_user' ? 'Core User Dashboard' : 'User Dashboard'}
          </h1>
          <Divider />
  
          <div className="user-info">
            <p><strong>Email:</strong> {user.email || 'Not Available'}</p>
            <p><strong>Username:</strong> {user.name || 'Not Available'}</p>
            <p><strong>Role:</strong> {user.role || 'Not Available'}</p>
            <p><strong>Employee Id:</strong> {user.employee_id || 'Not Available'}</p> {/* Employee ID Display */}
          </div>
  
          {user.role === 'admin' ? (
            <>
              <h2>Admin Stats Overview</h2>
              <div className="dashboard-row">
                <div className="dashboard-card">
                  <UserOutlined className="dashboard-icon" />
                  <h3 className="dashboard-stat-title">156</h3>
                  <p className="dashboard-stat-subtitle">New Employees</p>
                  <p className="dashboard-stat-increase">+12%</p>
                </div>
                <div className="dashboard-card">
                  <FileDoneOutlined className="dashboard-icon" />
                  <h3 className="dashboard-stat-title">98</h3>
                  <p className="dashboard-stat-subtitle">Pending Approvals</p>
                  <p className="dashboard-stat-increase">-8%</p>
                </div>
                <div className="dashboard-card">
                  <TeamOutlined className="dashboard-icon" />
                  <h3 className="dashboard-stat-title">4,521</h3>
                  <p className="dashboard-stat-subtitle">Total Employees</p>
                  <p className="dashboard-stat-increase">+5%</p>
                </div>
              </div>
            </>
          ) : user.role === 'core_user' ? (
            <>
              <h2>Core User Dashboard</h2>
              <p>Welcome to your core user dashboard! Here, you can manage your account and view relevant details.</p>
            </>
          ) : (
            <>
              <h2>User Dashboard</h2>
              <p>Welcome to your dashboard! Here, you can track your progress and manage your account details.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
