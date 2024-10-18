import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importing components and pages
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Calendar from './pages/calender/Calendar';
import DocumentManagement from './pages/document/DocumentManagement';
import LeaveApplication from './pages/leave/LeaveApplication';
import AssetManagement from './pages/assetsmanage/AssetManagement';
import SalaryManagement from './pages/salary/SalaryManagement';
import TeamManagement from './pages/team/TeamManagement';
import Role from './pages/roles/Role';
import UserTable from './components/UserTable';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute element={Dashboard} allowedRoles={['admin', 'user']} />} />
        <Route path="/calendar" element={<PrivateRoute element={Calendar} allowedRoles={['admin', 'user']} />} />
        <Route path="/document" element={<PrivateRoute element={DocumentManagement} allowedRoles={['admin']} />} />
        <Route path="/leave" element={<PrivateRoute element={LeaveApplication} allowedRoles={['user']} />} />
        <Route path="/assets" element={<PrivateRoute element={AssetManagement} allowedRoles={['admin']} />} />
        <Route path="/salary" element={<PrivateRoute element={SalaryManagement} allowedRoles={['admin']} />} />
        <Route path="/team" element={<PrivateRoute element={TeamManagement} allowedRoles={['admin']} />} />
        <Route path="/role" element={<PrivateRoute element={Role} allowedRoles={['admin']} />} />
        <Route path="/users" element={<PrivateRoute element={UserTable} allowedRoles={['admin']} />} />
        
        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </Router>
  );
};

export default App;
